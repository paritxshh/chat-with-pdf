import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { 
  LogInIcon, 
  FileText, 
  MessageSquare, 
  Zap, 
  Shield, 
  Users, 
  ArrowRight,
  Star,
  Upload,
  Brain,
  Search
} from 'lucide-react';
import FileUpload from "@/components/fileUpload";

export default async function Home() {
  const {userId} = await auth();
  const isAuth = !!userId;
  
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
              {isAuth ? (
                <div className="flex items-center space-x-5">
                  <Link href="/chat">
                    <Button variant="outline" className="font-poppins">Go to Chats</Button>
                  </Link>
                  <div className="flex items-center" style={{ transform: 'scale(1.3)' }}>
                    <UserButton />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/sign-in">
                    <Button variant="ghost" className="font-poppins">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="font-poppins">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 font-poppins">
              Chat with any{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PDF
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto font-poppins">
              Transform your documents into intelligent conversations. Ask questions, get instant answers, and unlock insights from your PDFs with AI-powered chat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {isAuth ? (
                <div className="w-full max-w-md">
                  <FileUpload />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/sign-up">
                    <Button size="lg" className="text-lg px-8 py-6 font-poppins">
                      Start Chatting Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button variant="outline" size="lg" className="text-lg px-8 py-6 font-poppins">
                      <LogInIcon className="mr-2 h-5 w-5" />
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2 font-poppins">10K+</div>
                <div className="text-slate-600 font-poppins">Documents Processed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2 font-poppins">50K+</div>
                <div className="text-slate-600 font-poppins">Questions Answered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2 font-poppins">99.9%</div>
                <div className="text-slate-600 font-poppins">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 font-poppins">
              Why Choose PaperTalk<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">.ai</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-poppins">
              Powerful features designed to make your document interactions seamless and intelligent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2 font-poppins">AI-Powered Analysis</h3>
              <p className="text-slate-600 font-poppins">Advanced AI understands context and provides accurate, relevant answers from your documents.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2 font-poppins">Lightning Fast</h3>
              <p className="text-slate-600 font-poppins">Get instant responses to your questions with our optimized processing engine.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2 font-poppins">Secure & Private</h3>
              <p className="text-slate-600 font-poppins">Your documents are encrypted and secure. We never share your data with third parties.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2 font-poppins">Smart Search</h3>
              <p className="text-slate-600 font-poppins">Find specific information across multiple documents with intelligent search capabilities.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2 font-poppins">Team Collaboration</h3>
              <p className="text-slate-600 font-poppins">Share insights and collaborate with your team on document analysis and research.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2 font-poppins">Easy Upload</h3>
              <p className="text-slate-600 font-poppins">Simply drag and drop your PDFs or upload from your device. No complex setup required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 font-poppins">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-poppins">
              Get started in minutes with our simple 3-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white font-poppins">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 font-poppins">Upload Your PDF</h3>
              <p className="text-slate-600 font-poppins">Drag and drop your PDF file or click to browse and upload from your device.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white font-poppins">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 font-poppins">AI Processing</h3>
              <p className="text-slate-600 font-poppins">Our AI analyzes your document, extracts key information, and prepares it for conversation.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white font-poppins">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 font-poppins">Start Chatting</h3>
              <p className="text-slate-600 font-poppins">Ask questions about your document and get instant, accurate answers powered by AI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 font-poppins">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-poppins">
              Join thousands of satisfied users who have transformed their document workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-4 font-poppins">
                "PaperTalk.ai has revolutionized how I research. I can now quickly find specific information in lengthy documents and get instant answers to complex questions."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  S
                </div>
                <div>
                  <div className="font-semibold text-slate-900 font-poppins">Sarah Johnson</div>
                  <div className="text-slate-600 text-sm font-poppins">Research Scientist</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-4 font-poppins">
                "As a student, this tool has been a game-changer. I can quickly understand complex academic papers and extract key insights for my research."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  M
                </div>
                <div>
                  <div className="font-semibold text-slate-900 font-poppins">Michael Chen</div>
                  <div className="text-slate-600 text-sm font-poppins">Graduate Student</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-4 font-poppins">
                "The AI-powered analysis is incredibly accurate. It saves me hours of manual document review and helps me make better business decisions."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  A
                </div>
                <div>
                  <div className="font-semibold text-slate-900 font-poppins">Alex Rodriguez</div>
                  <div className="text-slate-600 text-sm font-poppins">Business Analyst</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4 font-poppins">
            Ready to Transform Your Documents?
          </h2>
          <p className="text-xl text-blue-100 mb-8 font-poppins">
            Join thousands of users who are already saving time and gaining insights with <span className="font-bold">PaperTalk.ai</span>.
          </p>
          {!isAuth && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 font-poppins">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="font-poppins text-lg font-semibold px-8 py-6 border-white text-black hover:bg-white hover:text-blue-600">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold font-poppins">PaperTalk.ai</span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md font-poppins">
                Transform your documents into intelligent conversations with AI-powered chat. Ask questions, get instant answers, and unlock insights from your PDFs.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 font-poppins">Product</h3>
              <ul className="space-y-2 text-slate-400 font-poppins">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 font-poppins">Support</h3>
              <ul className="space-y-2 text-slate-400 font-poppins">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 font-poppins">
            <p>&copy; {new Date().getFullYear()} <span className="font-bold">PaperTalk.ai</span> All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}