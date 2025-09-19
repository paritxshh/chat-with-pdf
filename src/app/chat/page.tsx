import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle, PlusCircle, FileText, Calendar, ArrowRight } from 'lucide-react';
import NewChatDialog from '@/components/NewChatDialog';

export default async function ChatPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return redirect('/sign-in');
  }

  // Fetch all chats for the user
  const userChats = await db.select().from(chats).where(eq(chats.userId, userId));

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const truncateFileName = (fileName: string, maxLength: number = 30) => {
    if (fileName.length <= maxLength) return fileName;
    
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    
    if (nameWithoutExt.length <= maxLength - (extension?.length || 0) - 1) {
      return fileName;
    }
    
    const charsToShow = Math.max(3, maxLength - (extension?.length || 0) - 4);
    const start = nameWithoutExt.substring(0, charsToShow);
    const end = nameWithoutExt.substring(nameWithoutExt.length - 3);
    
    return `${start}....${end}.${extension}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold font-poppins">
                <span className="text-slate-900">PaperTalk</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">.ai</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="font-poppins">Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-poppins">
              Your Chat History
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-poppins">
              Continue your conversations with your PDFs or start a new chat
            </p>
          </div>

          {/* Chat Grid */}
          {userChats.length === 0 ? (
            // Empty State
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4 font-poppins">
                No chats yet
              </h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto font-poppins">
                Upload your first PDF to start chatting with your documents
              </p>
              <NewChatDialog />
            </div>
          ) : (
            // Chat Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userChats.map((chat) => (
                <Link key={chat.id} href={`/chat/${chat.id}`}>
                  <div className="bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-200 hover:border-blue-300 group">
                    <div className="p-6">
                      {/* PDF Icon and Name */}
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900 mb-1 font-poppins group-hover:text-blue-600 transition-colors">
                            {truncateFileName(chat.pdfName)}
                          </h3>
                          <p className="text-sm text-slate-500 font-poppins">
                            PDF Document
                          </p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center text-slate-500 mb-4">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm font-poppins">
                          {formatDate(chat.createdAt)}
                        </span>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 font-poppins">
                          Continue Chat
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* New Chat Button */}
          {userChats.length > 0 && (
            <div className="text-center mt-12">
              <NewChatDialog />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
