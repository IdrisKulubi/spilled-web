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
  urgent: z.boolean(),
});

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  urgent: boolean;
};

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      urgent: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Form submitted:", data);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FFF8F9] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-[#76C893] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#3B3B3B] mb-4">Message Sent!</h1>
          <p className="text-lg text-[#3B3B3B] mb-6 opacity-80">
            Thank you for reaching out. We&apos;ll get back to you within 24 hours.
          </p>
          <Button 
            onClick={() => setIsSubmitted(false)}
            className="bg-[#D96BA0] hover:bg-[#D96BA0]/90 text-white"
          >
            Send Another Message
          </Button>
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
            Have questions about Spilled? Need support? We&apos;re here to help. 
            Reach out to us and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-8">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#D96BA0] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
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
                <div className="w-12 h-12 bg-[#D96BA0] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#3B3B3B] mb-1">Call Us</h3>
                  <p className="text-[#3B3B3B] opacity-80">+1 (555) 123-4567</p>
                  <p className="text-sm text-[#3B3B3B] opacity-60 mt-1">
                    Monday - Friday, 9 AM - 6 PM EST
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#D96BA0] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#3B3B3B] mb-1">Visit Us</h3>
                  <p className="text-[#3B3B3B] opacity-80">
                    123 Safety Street<br />
                    Women&apos;s District<br />
                    Safety City, SC 12345
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-[#FDECEF] rounded-lg">
              <h3 className="font-semibold text-[#3B3B3B] mb-2">Emergency Support</h3>
              <p className="text-sm text-[#3B3B3B] opacity-80">
                If you&apos;re in immediate danger, please contact local emergency services. 
                For urgent safety concerns related to the platform, mark your message as &quot;Urgent&quot; below.
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
                      <FormLabel className="text-[#3B3B3B] font-medium">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your full name" 
                          className="border-gray-200 focus:border-[#D96BA0] focus:ring-[#D96BA0]"
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
                      <FormLabel className="text-[#3B3B3B] font-medium">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="your.email@example.com" 
                          className="border-gray-200 focus:border-[#D96BA0] focus:ring-[#D96BA0]"
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
                          placeholder="What is this about?" 
                          className="border-gray-200 focus:border-[#D96BA0] focus:ring-[#D96BA0]"
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
                          placeholder="Tell us more about your question or concern..."
                          className="border-gray-200 focus:border-[#D96BA0] focus:ring-[#D96BA0] min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 text-[#D96BA0] focus:ring-[#D96BA0] border-gray-300 rounded"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-[#3B3B3B] font-medium">
                          This is urgent
                        </FormLabel>
                        <p className="text-sm text-[#3B3B3B] opacity-60">
                          Check this if you need immediate assistance with a safety concern
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#D96BA0] hover:bg-[#D96BA0]/90 text-white py-3 text-lg font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-[#3B3B3B] opacity-70">
                By sending this message, you agree to our privacy policy. 
                We&apos;ll only use your information to respond to your inquiry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}