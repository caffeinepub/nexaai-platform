import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type BlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    category : Text;
    imageUrl : Text;
    timestamp : Time.Time;
  };

  // Data Stores
  let blogPosts = List.empty<BlogPost>();
  let _ids = Map.empty<Nat, { var nextId : Nat }>();

  module BlogPost {
    public func compare(blogPost1 : BlogPost, blogPost2 : BlogPost) : Order.Order {
      Nat.compare(blogPost1.id, blogPost2.id);
    };
  };

  // Helper Functions
  func getNextId() : Nat {
    let current = switch (_ids.get(0)) {
      case (null) {
        _ids.add(0, { var nextId = 1 });
        0;
      };
      case (?idCounter) {
        let next = idCounter.nextId;
        idCounter.nextId += 1;
        next;
      };
    };
    current;
  };

  // Initialization
  public shared ({ caller }) func initialize() : async () {
    AccessControl.initialize(accessControlState, caller, "", "");
    // Seed blog posts if not already seeded
    let isEmpty = blogPosts.isEmpty();
    if (isEmpty) {
      let dummyPosts = [
        {
          id = getNextId();
          title = "Welcome to NexaAI!";
          content = "This is your first blog post on the platform.";
          author = "Nexa Team";
          category = "Announcement";
          imageUrl = "https://example.com/image1.jpg";
          timestamp = Time.now();
        },
        {
          id = getNextId();
          title = "Getting Started with AI";
          content = "A beginner's guide to AI tools.";
          author = "Jane Doe";
          category = "Tutorial";
          imageUrl = "https://example.com/image2.jpg";
          timestamp = Time.now();
        },
        {
          id = getNextId();
          title = "Platform Tips";
          content = "Maximize your productivity with these tips.";
          author = "John Smith";
          category = "Tips";
          imageUrl = "https://example.com/image3.jpg";
          timestamp = Time.now();
        },
        {
          id = getNextId();
          title = "AI in Business";
          content = "Transform your business with AI solutions.";
          author = "Business Guru";
          category = "Industry";
          imageUrl = "https://example.com/image4.jpg";
          timestamp = Time.now();
        },
        {
          id = getNextId();
          title = "Tech News";
          content = "Latest updates in the tech world.";
          author = "Tech Insider";
          category = "News";
          imageUrl = "https://example.com/image5.jpg";
          timestamp = Time.now();
        },
        {
          id = getNextId();
          title = "Community Spotlight";
          content = "Highlighting our awesome users.";
          author = "Nexa Community";
          category = "Community";
          imageUrl = "https://example.com/image6.jpg";
          timestamp = Time.now();
        },
      ];
      blogPosts.addAll(dummyPosts.values());
    };
  };

  // Blog Functionality

  public query ({ caller }) func getAllBlogPosts() : async [BlogPost] {
    // Public read access - no authorization check needed (accessible to guests)
    blogPosts.toArray().sort();
  };

  public query ({ caller }) func getBlogPostById(id : Nat) : async BlogPost {
    // Public read access - no authorization check needed (accessible to guests)
    switch (blogPosts.find(func(post) { post.id == id })) {
      case (?post) { post };
      case (null) { Runtime.trap("Blog post not found") };
    };
  };

  public shared ({ caller }) func createBlogPost(title : Text, content : Text, author : Text, category : Text, imageUrl : Text) : async Nat {
    // Admin-only: Only admins can create blog posts
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };

    let newPost : BlogPost = {
      id = getNextId();
      title;
      content;
      author;
      category;
      imageUrl;
      timestamp = Time.now();
    };
    blogPosts.add(newPost);
    newPost.id;
  };

  public shared ({ caller }) func deleteBlogPost(id : Nat) : async () {
    // Admin-only: Only admins can delete blog posts
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };

    let filtered = blogPosts.filter(func(post) { post.id != id });
    blogPosts.clear();
    blogPosts.addAll(filtered.values());
  };
};
