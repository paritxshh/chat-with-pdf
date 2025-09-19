'use client'
import { uploadToS3 } from '@/lib/s3'
import { useMutation } from '@tanstack/react-query'
import { Inbox, Loader2, FileText, Upload, PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const NewChatDialog = () => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ file_key, file_name }: { file_key: string, file_name: string }) => {
      const response = await axios.post('/api/create-chat', {
        file_key,
        file_name,
      })
      return response.data;
    }
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb
        toast.error('File size is too large. Please upload a file smaller than 10MB.');
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data?.file_name) {
          toast.error('Something went wrong');
          return;
        }
        mutate(data, {
          onSuccess: ({chat_id}) => {
            toast.success('Chat created successfully');
            setOpen(false);
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            toast.error('Error creating chat');
            console.log(err);
          }
        });
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-poppins font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl'>
          <PlusCircle className='mr-2 w-4 h-4'/>
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 font-poppins">
            Start New Chat
          </DialogTitle>
          <DialogDescription className="text-slate-600 font-poppins">
            Upload a PDF document to start a new conversation with AI
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <div {...getRootProps({
            className: 'border-dashed border-2 border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors py-12 flex justify-center items-center flex-col',
          })}>
            <input {...getInputProps()} />
            {(uploading || isPending) ? (
              <>
                {/* loading state */}
                <Loader2 className='w-12 h-12 text-blue-500 animate-spin mb-4' />
                <p className='text-lg text-slate-600 font-poppins font-semibold dialog-pulse'>Spilling Coffee on your PDF...</p>
                <p className='text-sm text-slate-500 font-poppins mt-2'>This may take a few moments</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className='w-8 h-8 text-blue-600' />
                </div>
                <p className='text-lg text-slate-700 font-poppins font-semibold mb-2'>
                  Drop your PDF here
                </p>
                <p className='text-sm text-slate-500 font-poppins mb-4'>
                  or click to browse files
                </p>
                <div className="flex items-center text-xs text-slate-400 font-poppins">
                  <FileText className="w-4 h-4 mr-1" />
                  PDF files only • Max 10MB
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="font-poppins"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewChatDialog
