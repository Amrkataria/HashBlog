import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Account, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl) // Appwrite endpoint
            .setProject(conf.appwriteProjectId); // Appwrite project ID

        this.databases = new Databases(this.client); // Initialize Databases service
        this.bucket = new Storage(this.client);      // Initialize Storage service
        this.account = new Account(this.client);     // Initialize Account service for authentication
    }

    // Method to get the authenticated user's ID and name
    async getUserDetails() {
        try {
            const user = await this.account.get(); // Get authenticated user details
            return { userId: user.$id, userName: user.name }; // Return user ID and name
        } catch (error) {
            console.log("Appwrite service :: getUserDetails :: error", error);
            return null; // Return null if user is not authenticated
        }
    }

    // Create a new post with the user ID and name
    async createPost({ title, slug, content, featuredImage, status }) {
        try {
            const userDetails = await this.getUserDetails();
            if (!userDetails) throw new Error("User not authenticated");

            const { userId, userName } = userDetails;

            // Ensure userId is a string and under 25 characters
            if (typeof userId !== 'string' || userId.length > 25) {
                throw new Error("Invalid user ID format or length");
            }

            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                    userName, // Add userName to the post
                }
            );
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
        }
    }

    // Update an existing post
    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug, // Document ID (slug)
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            );
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
        }
    }

    // Delete a post by slug (document ID)
    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug // Document ID (slug)
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    // Get a single post by slug (document ID)
    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug // Document ID (slug)
            );
        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error);
            return false;
        }
    }

    // Get a list of posts with a query (default to active posts)
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }

    // File upload service
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(), // Generate a unique file ID
                file // File to upload
            );
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }

    // Delete a file by its ID
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId // File ID
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    // Get file preview
    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId // File ID
        );
    }

    // Subscribe a user via email
    async subscribe({ email }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteEmailCollectionId,
                ID.unique(), // Generate a unique document ID
                { email }
            );
        } catch (error) {
            console.log("Appwrite service :: subscribe :: error", error);
        }
    }
}

// Export the service for use in other parts of the app


// Export the service for use in other parts of the app
const service = new Service();
export default service;