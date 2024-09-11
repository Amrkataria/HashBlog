import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, content, title, featuredImage, userName }) {
  const id = $id.toString();

  return (
    <Link to={`/post/${id}`}>
      <div className="max-w h-auto rounded-lg border border-gray-200 shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <div className="w-full">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="rounded-t-lg h-48 w-full object-cover"
          />
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>

          <h3 className="text-gray-600 text-sm mb-4">By: {userName}</h3>

          <Link
            to={`/post/${id}`}
            className="inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            See Post
          </Link>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
