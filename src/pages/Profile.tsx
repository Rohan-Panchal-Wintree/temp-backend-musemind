import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { AudioPlayer } from "@/components/AudioPlayer";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import {
  Heart,
  Trash2,
  User,
  Calendar,
  Edit3,
  Save,
  X,
  Grid2X2,
  List,
  CreditCard,
  FileText,
  Eye,
  Download,
  FileHeart,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import axios from "axios";
import Modal from "@/components/ui/modal";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "@/components/ui/confirmDialog";

const TRACKS_PER_PAGE = 10;

const Profile = () => {
  const {
    user,
    savedTracks,
    savedLyrics,
    isLoadingUserData,
    removeTrack,
    removeLyric,
    updateUsername,
  } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeTab, setActiveTab] = useState<"audio" | "lyrics">("audio");

  // modal states
  const [isLyricModalOpen, setIsLyricModalOpen] = useState(false);
  const [lyricModalTitle, setLyricModalTitle] = useState("");
  const [lyricModalText, setLyricModalText] = useState("");
  const [isLyricLoading, setIsLyricLoading] = useState(false);

  // Calculate pagination
  const totalPages = Math.ceil(savedTracks.length / TRACKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TRACKS_PER_PAGE;
  const endIndex = startIndex + TRACKS_PER_PAGE;
  const currentTracks = savedTracks.slice(startIndex, endIndex);

  // Navigation
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.name) {
      setEditName(user.name);
    }
  }, [user]);

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    updateUsername(editName);

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(user?.name || "");
    setIsEditing(false);
  };

  const handleRemoveTrack = (trackId: string) => {
    removeTrack(trackId);

    // Adjust current page if needed after deletion
    const newTotalPages = Math.ceil((savedTracks.length - 1) / TRACKS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleRemoveLyric = async (lyricId: string) => {
    await removeLyric(lyricId);
  };

  const handleDownloadLyric = async (url: string, title: string) => {
    try {
      const resp = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([resp.data], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${title.replace(/\s+/g, "_")}.txt`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    } catch (error) {
      console.error("error fetching the lyrics text", error);
      toast.error("Download failed");
    }
  };

  // Modal handle function
  const openLyricModal = async (url: string, title: string) => {
    setIsLyricModalOpen(true);
    setLyricModalTitle(title);
    setLyricModalText("");
    setIsLyricLoading(true);

    try {
      const resp = await axios.get(url, { responseType: "text" });
      const text =
        typeof resp.data === "string"
          ? resp.data
          : new TextDecoder().decode(resp.data);
      setLyricModalText(text);
    } catch (error) {
      setLyricModalText("Failed to load lyrics.");
    } finally {
      setIsLyricLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <main className="container mx-auto px-6 pt-32 pb-16">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">
              Please log in to view your profile
            </h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 mb-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-green-500 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Name
                      </label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-slate-700/50 border-purple-500/30 text-white"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveProfile}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="flex items-center text-3xl font-bold text-white mb-2 capitalize">
                      {user.name}
                    </h1>
                    <p className="text-gray-400 mb-4">{user.email}</p>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Member since {formatDate(user.createdAt)}
                      </div>

                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-400" />
                        Liked Tracks: {savedTracks.length}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileHeart className="w-4 h-4 text-pink-400" />
                        Liked Lyrics: {savedLyrics.length}
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </div>

              {/* Credits & Actions */}
              <div className="flex flex-col gap-3">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="flex justify-center text-2xl font-bold text-white">
                    <div className="text-2xl mb-1 mr-1">🎵</div>
                    {user.credits}
                  </div>
                  <div className="text-sm text-gray-400">Credits Remaining</div>
                </div>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                  to="/pricing"
                >
                  <CreditCard /> Buy More Credits
                </Button>
              </div>
            </div>
          </div>

          {/* Saved Tracks Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <div className="flex items-center justify-between mb-8">
              {/* <h2 className="text-2xl font-bold text-white">
                💾 Your Saved Tracks
              </h2> */}

              <h2 className="flex items-center text-2xl font-bold text-white">
                <Save className="mr-2" /> Your Saved{" "}
                {`${activeTab === "audio" ? "Tracks" : "Lyrics"}`}
              </h2>

              {savedTracks.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="p-2"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="p-2"
                  >
                    <Grid2X2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "audio" | "lyrics")}
            >
              <TabsList className="bg-slate-700/40 text-white rounded-md">
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
                {/* <TabsTrigger value="orders">Orders</TabsTrigger> */}
              </TabsList>

              {/* AUDIO TAB */}
              <TabsContent value="audio">
                {isLoadingUserData ? (
                  // 🌀 Spinner
                  <div className="flex justify-center items-center py-12">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                ) : savedTracks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎵</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No saved tracks yet
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Start generating music and save your favorites!
                    </p>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                      to="/"
                    >
                      Create Your First Track
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Tracks Display */}
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                          : "space-y-6"
                      }
                    >
                      {currentTracks.map((track) => (
                        <div
                          key={track.id}
                          className="bg-slate-700/50 rounded-xl p-6 border border-purple-500/20"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-white font-semibold mb-1">
                                {/* {track.title} */}
                                Created {formatDate(track.dateCreated)}
                              </h3>
                              {/* <p className="text-gray-400 text-sm">
                            Created {formatDate(track.dateCreated)}
                          </p> */}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
                              >
                                <Heart className="w-4 h-4 fill-current" />
                              </Button>
                              {/* <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveTrack(track.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button> */}
                              <ConfirmDialog
                                trigger={
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    aria-label="Delete track"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                }
                                title="Delete this track?"
                                description="This will permanently remove the saved track. This action cannot be undone."
                                confirmText="Delete"
                                onConfirm={() => handleRemoveTrack(track.id)}
                              />
                            </div>
                          </div>
                          <AudioPlayer track={track} />
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (currentPage > 1)
                                    setCurrentPage(currentPage - 1);
                                }}
                                className={
                                  currentPage === 1
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                }
                              />
                            </PaginationItem>

                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(page);
                                  }}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}

                            <PaginationItem>
                              <PaginationNext
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (currentPage < totalPages)
                                    setCurrentPage(currentPage + 1);
                                }}
                                className={
                                  currentPage === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                }
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              {/* LYRICS TAB */}
              <TabsContent value="lyrics">
                {isLoadingUserData ? (
                  // 🌀 Spinner
                  <div className="flex justify-center items-center py-12">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                ) : savedLyrics.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No saved lyrics yet
                    </h3>
                    <p className="text-gray-400">
                      Generate lyrics and save your favorites!
                    </p>
                  </div>
                ) : (
                  //  Lyrics List
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                        : "space-y-3"
                    }
                  >
                    {savedLyrics.map((ly) => (
                      <div
                        key={ly.id}
                        className="flex items-center justify-between bg-slate-700/50 rounded-lg p-4 border border-purple-500/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-slate-800 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-300" />
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {ly.title}
                            </div>
                            <div className="text-xs text-gray-400">
                              Created {formatDate(ly.dateCreated)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openLyricModal(ly.url, ly.title)}
                            className="text-blue-300 hover:bg-blue-300/10 hover:text-white"
                          >
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDownloadLyric(ly.downloadUrl, ly.title)
                            }
                            className="text-green-200 hover:text-white hover:bg-green-500/10"
                          >
                            <Download className="w-4 h-4 mr-1" /> Download
                          </Button>
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveLyric(ly.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button> */}
                          <ConfirmDialog
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                aria-label="Delete lyrics"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            }
                            title="Delete these lyrics?"
                            description="This will permanently remove the saved lyrics. This action cannot be undone."
                            confirmText="Delete"
                            onConfirm={() => handleRemoveLyric(ly.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="orders"></TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Modal */}
        <Modal
          open={isLyricModalOpen}
          onClose={() => setIsLyricModalOpen(false)}
          title={lyricModalTitle}
          size="xl"
          footer={
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                onClick={() => setIsLyricModalOpen(false)}
              >
                Close
              </Button>
            </div>
          }
        >
          {isLyricLoading ? (
            <div className="text-gray-300">Loading lyrics…</div>
          ) : (
            <div className="text-gray-300">{lyricModalText}</div>
          )}
        </Modal>
      </main>
    </div>
  );
};

export default Profile;
