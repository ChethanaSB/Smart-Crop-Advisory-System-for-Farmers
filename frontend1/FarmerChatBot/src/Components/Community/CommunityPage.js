import React from "react";
import { Heart, MessageCircle, Share2, Sprout, Tractor, Wheat } from "lucide-react";

// ✅ Import local images
import img1 from "./Images/img1.jpg";
import img2 from "./Images/img2.jpg";
import img3 from "./Images/img3.jpg";

const posts = [
  {
    id: 1,
    author: "Farmer Ramesh",
    avatar: <Tractor className="w-11 h-11 p-2 bg-green-100 text-green-600 rounded-full" />,
    time: "2h ago",
    content: "Just tried a new organic fertilizer. Crops are looking healthier than before.",
    image: img1,
    likes: 34,
    comments: 12,
  },
  {
    id: 2,
    author: "Farmer Priya",
    avatar: <Sprout className="w-11 h-11 p-2 bg-yellow-100 text-yellow-600 rounded-full" />,
    time: "5h ago",
    content: "Any suggestions for pest control in paddy fields?",
    image: img2,
    likes: 22,
    comments: 5,
  },
  {
    id: 3,
    author: "Farmer Rohit",
    avatar: <Wheat className="w-11 h-11 p-2 bg-orange-100 text-orange-600 rounded-full" />,
    time: "1d ago",
    content: "Harvest season is here. Grateful for the timely rains.",
    image: img3,
    likes: 56,
    comments: 20,
  },
];

export default function FarmerCommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 mt-16">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Create Post Box */}
        <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
          <Sprout className="w-11 h-11 p-2 bg-green-100 text-green-600 rounded-full" />
          <input
            type="text"
            placeholder="Share your farming experience..."
            className="w-full bg-gray-100 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Posts Feed */}
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-5 space-y-4"
          >
            {/* Post Header */}
            <div className="flex items-center gap-3">
              {post.avatar}
              <div>
                <h3 className="font-semibold text-gray-800">{post.author}</h3>
                <p className="text-sm text-gray-500">{post.time}</p>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-700 leading-relaxed">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="post"
                className="w-full rounded-lg object-cover max-h-80"
              />
            )}

            {/* Actions */}
            <div className="flex items-center justify-around text-gray-600 text-sm pt-3 border-t">
              <button className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 transition">
                <Heart size={18} className="text-gray-500" /> {post.likes}
              </button>
              <button className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 transition">
                <MessageCircle size={18} className="text-gray-500" /> {post.comments}
              </button>
              <button className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 transition">
                <Share2 size={18} className="text-gray-500" /> Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
