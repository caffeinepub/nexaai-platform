import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Outcall "http-outcalls/outcall";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type BlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    category : Text;
    imageUrl : Text;
    timestamp : Time.Time;
  };

  type UserProfile = {
    displayName : Text;
    bio : Text;
    updatedAt : Time.Time;
  };

  type AIHistoryEntry = {
    id : Nat;
    toolName : Text;
    input : Text;
    output : Text;
    timestamp : Time.Time;
  };

  public type LicenseKey = {
    key : Text;
    isActive : Bool;
    activatedBy : ?Principal.Principal;
    createdAt : Time.Time;
  };

  let blogPosts = List.empty<BlogPost>();
  let _ids = Map.empty<Nat, { var nextId : Nat }>();
  var groqApiKey : Text = "";
  let userProfiles = Map.empty<Principal.Principal, UserProfile>();
  let aiHistory = Map.empty<Principal.Principal, List.List<AIHistoryEntry>>();
  var historyIdCounter : Nat = 0;
  let licenseKeys = Map.empty<Text, LicenseKey>();

  module BlogPost {
    public func compare(a : BlogPost, b : BlogPost) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  func getNextId() : Nat {
    switch (_ids.get(0)) {
      case (null) { _ids.add(0, { var nextId = 1 }); 0 };
      case (?c) { let n = c.nextId; c.nextId += 1; n };
    };
  };

  func getNextHistoryId() : Nat {
    let id = historyIdCounter;
    historyIdCounter += 1;
    id;
  };

  func seedDefaultData() {
    if (blogPosts.isEmpty()) {
      blogPosts.addAll([
        { id = getNextId(); title = "Welcome to NexaAI!"; content = "Explore AI tools, manage your profile, and unlock Pro features."; author = "Nexa Team"; category = "Announcement"; imageUrl = "/assets/generated/blog-ai-future.dim_800x400.jpg"; timestamp = Time.now() },
        { id = getNextId(); title = "Getting Started with AI"; content = "A beginner guide to using AI tools for productivity."; author = "Ayan"; category = "Tutorial"; imageUrl = "/assets/generated/blog-ai-models.dim_400x240.jpg"; timestamp = Time.now() },
        { id = getNextId(); title = "AI in Business"; content = "Transform your business with AI solutions."; author = "Nexa Team"; category = "Industry"; imageUrl = "/assets/generated/blog-cloud-infra.dim_800x400.jpg"; timestamp = Time.now() },
      ].values());
    };
    if (licenseKeys.get("AYAN") == null) {
      licenseKeys.add("AYAN", { key = "AYAN"; isActive = true; activatedBy = null; createdAt = Time.now() });
    };
  };

  func promoteToAdmin(caller : Principal.Principal) {
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
    seedDefaultData();
  };

  public shared ({ caller }) func initialize() : async () {
    if (not caller.isAnonymous()) { promoteToAdmin(caller) };
  };

  // setGroqApiKey: always promotes caller to admin then saves -- no lockout possible
  public shared ({ caller }) func setGroqApiKey(key : Text) : async () {
    if (caller.isAnonymous()) { Runtime.trap("Must be logged in") };
    promoteToAdmin(caller);
    groqApiKey := key;
  };

  public query func getAllBlogPosts() : async [BlogPost] {
    blogPosts.toArray().sort();
  };

  public query func getBlogPostById(id : Nat) : async BlogPost {
    switch (blogPosts.find(func(p) { p.id == id })) {
      case (?p) { p };
      case (null) { Runtime.trap("Blog post not found") };
    };
  };

  public shared ({ caller }) func createBlogPost(title : Text, content : Text, author : Text, category : Text, imageUrl : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) { Runtime.trap("Unauthorized") };
    let p : BlogPost = { id = getNextId(); title; content; author; category; imageUrl; timestamp = Time.now() };
    blogPosts.add(p);
    p.id;
  };

  public shared ({ caller }) func deleteBlogPost(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) { Runtime.trap("Unauthorized") };
    let filtered = blogPosts.filter(func(p) { p.id != id });
    blogPosts.clear();
    blogPosts.addAll(filtered.values());
  };

  public shared ({ caller }) func activateKey(key : Text) : async Bool {
    switch (licenseKeys.get(key)) {
      case (null) { false };
      case (?k) {
        if (not k.isActive) { return false };
        licenseKeys.add(key, { key = k.key; isActive = k.isActive; activatedBy = ?caller; createdAt = k.createdAt });
        true;
      };
    };
  };

  public query func checkKeyValid(key : Text) : async Bool {
    switch (licenseKeys.get(key)) {
      case (null) { false };
      case (?k) { k.isActive };
    };
  };

  public shared ({ caller }) func generateKey() : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) { Runtime.trap("Unauthorized") };
    let k = "NEXA-" # Time.now().toText();
    licenseKeys.add(k, { key = k; isActive = true; activatedBy = null; createdAt = Time.now() });
    k;
  };

  public shared ({ caller }) func addCustomKey(customKey : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) { Runtime.trap("Unauthorized") };
    if (customKey.size() == 0 or licenseKeys.get(customKey) != null) { return false };
    licenseKeys.add(customKey, { key = customKey; isActive = true; activatedBy = null; createdAt = Time.now() });
    true;
  };

  public shared ({ caller }) func revokeKey(key : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) { Runtime.trap("Unauthorized") };
    switch (licenseKeys.get(key)) {
      case (null) { false };
      case (?k) {
        licenseKeys.add(key, { key = k.key; isActive = false; activatedBy = null; createdAt = k.createdAt });
        true;
      };
    };
  };

  public query ({ caller }) func hasProStatus() : async Bool {
    licenseKeys.toArray().any(func((_, k)) { k.activatedBy == ?caller });
  };

  public query ({ caller }) func getAllKeys() : async [LicenseKey] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) { Runtime.trap("Unauthorized") };
    licenseKeys.values().toArray();
  };

  public query ({ caller }) func getUserKeys() : async [LicenseKey] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) { Runtime.trap("Unauthorized") };
    licenseKeys.values().filter(func(k) { k.activatedBy == ?caller }).toArray();
  };

  public query func transformResponse(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    { status = input.response.status; headers = []; body = input.response.body };
  };

  public shared func callGroqAI(prompt : Text, systemPrompt : Text) : async Text {
    let body = "{\"model\":\"llama3-8b-8192\",\"messages\":[{\"role\":\"system\",\"content\":\"" # systemPrompt # "\"},{\"role\":\"user\",\"content\":\"" # prompt # "\"}],\"max_tokens\":1024}";
    let headers : [Outcall.Header] = [
      { name = "Content-Type"; value = "application/json" },
      { name = "Authorization"; value = "Bearer " # groqApiKey },
    ];
    await Outcall.httpPostRequest("https://api.groq.com/openai/v1/chat/completions", headers, body, transformResponse);
  };

  public shared ({ caller }) func updateUserProfile(displayName : Text, bio : Text) : async () {
    userProfiles.add(caller, { displayName; bio; updatedAt = Time.now() });
  };

  public query func getUserProfile(user : Principal.Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public query ({ caller }) func getMyProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveAIHistory(toolName : Text, input : Text, output : Text) : async Nat {
    let entry : AIHistoryEntry = { id = getNextHistoryId(); toolName; input; output; timestamp = Time.now() };
    let existing = switch (aiHistory.get(caller)) {
      case (null) { List.empty<AIHistoryEntry>() };
      case (?l) { l };
    };
    existing.add(entry);
    aiHistory.add(caller, existing);
    entry.id;
  };

  public query ({ caller }) func getMyHistory() : async [AIHistoryEntry] {
    switch (aiHistory.get(caller)) {
      case (null) { [] };
      case (?l) { let a = l.toArray(); a.reverse() };
    };
  };

  public shared ({ caller }) func clearMyHistory() : async () {
    aiHistory.remove(caller);
  };

};
