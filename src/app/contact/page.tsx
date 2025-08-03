"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Contact form submitted:", data);
    setIsSubmitted(true);
    setIsSubmitting(false);
    form.reset();
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FFF8F9] flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-[#76C893] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#3B3B3B] mb-4">Message Sent!</h1>
            <p className="text-lg text-[#3B3B3B] mb-6 opacity-80">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="bg-[#D96BA0] hover:bg-[#D96BA0]/90 text-white"
            >
              Send Another Message
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F9]">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#3B3B3B] mb-6">Contact Us</h1>
          <p className="text-xl text-[#3B3B3B] opacity-80 max-w-2xl mx-auto">
            Have questions about Spilled? Need support? We're here to help. 
            Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#FDECEF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#D96BA0]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#3B3B3B] mb-1">Email Us</h3>
                  <p className="text-[#3B3B3B] opacity-80">support@spilled.app</p>
                  <p className="text-sm text-[#3B3B3B] opacity-60 mt-1">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#FDECEF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#D96BA0]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#3B3B3B] mb-1">Support Hours</h3>
                  <p className="text-[#3B3B3B] opacity-80">Monday - Friday</p>
                  <p className="text-[#3B3B3B] opacity-80">9:00 AM - 6:00 PM EAT</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#FDECEF] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#D96BA0]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#3B3B3B] mb-1">Location</h3>
                  <p className="text-[#3B3B3B] opacity-80">Nairobi, Kenya</p>
                  <p className="text-sm text-[#3B3B3B] opacity-60 mt-1">
                    Serving women across East Africa
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-[#FDECEF] rounded-lg">
              <h3 className="font-semibold text-[#3B3B3B] mb-2">Emergency Support</h3>
              <p className="text-sm text-[#3B3B3B] opacity-80">
                If you're in immediate danger, please contact local emergency services. 
                For urgent safety concerns related to the platform, mark your message as "Urgent" below.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-6">Send us a Message</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#3B3B3B] font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          className="border-gray-200 focus:border-[#D96BA0] focus:ring-[#D96BA0]/20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#3B3B3B] font-medium">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="Enter your email address" 
                          className="border-gray-200 focus:border-[#D96BA0] focus:ring-[#D96BA0]/20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#3B3B3B] font-medium">Subject</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What's this about?" 
                          className="border-gray-200 focus:border-[#D96BA0] focus:ring-[#D96BA0]/20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#3B3B3B] font-medium">Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us how we can help you..."
                          className="border-gray-200 focus:border-[#D96BA0] focus:ring-[#D96BA0]/20 min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#D96BA0] hover:bg-[#D96BA0]/90 text-white h-12 text-base font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-[#3B3B3B] opacity-70">
                By sending this message, you agree to our privacy policy. 
                We'll only use your information to respond to your inquiry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}