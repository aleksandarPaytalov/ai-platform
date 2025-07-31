import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tool Not Found',
  description: 'The AI tool you are looking for could not be found. Browse our directory of 15+ AI development tools or return to the main tools page.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ToolsNotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <li>
            <Link 
              href="/" 
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <Link 
              href="/tools" 
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Tools
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li aria-current="page" className="text-gray-900 dark:text-gray-100 font-medium">
            Not Found
          </li>
        </ol>
      </nav>

      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Icon */}
        <div className="mx-auto h-20 w-20 text-gray-400 dark:text-gray-500 mb-8" aria-hidden="true">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          AI Tool Not Found
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          The AI development tool you're looking for doesn't exist or may have been 
          moved. Let's help you find the right tool for your needs.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4 mb-12">
          <Link
            href="/tools"
            className="inline-block w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Browse All AI Tools
          </Link>
          
          <div className="flex justify-center space-x-4">
            <Link
              href="/"
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Dashboard
            </Link>
            
            <Link
              href="/tools"
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Go Back
            </Link>
          </div>
        </div>

        {/* Popular AI Tool Categories */}
        <div className="text-left">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Popular AI Tool Categories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden="true">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Code Generation
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                AI tools that help generate, complete, and optimize code across multiple programming languages.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Examples: GitHub Copilot, CodeT5, Tabnine
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 text-green-600 dark:text-green-400" aria-hidden="true">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Conversational AI
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Large language models and chatbots for natural language processing and conversation.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Examples: ChatGPT, Claude, Gemini
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 text-purple-600 dark:text-purple-400" aria-hidden="true">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Image Generation
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                AI-powered tools for creating, editing, and enhancing images and visual content.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Examples: DALL-E, Midjourney, Stable Diffusion
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 text-orange-600 dark:text-orange-400" aria-hidden="true">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Data Analysis
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                AI tools for data processing, analysis, visualization, and machine learning workflows.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Examples: DataRobot, H2O.ai, AutoML
              </div>
            </div>
          </div>
        </div>

        {/* Search Suggestions */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Search Suggestions
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'chatgpt', 'claude', 'copilot', 'gemini', 'dall-e', 
              'midjourney', 'stable-diffusion', 'openai', 'anthropic'
            ].map((suggestion) => (
              <Link
                key={suggestion}
                href={`/tools/${suggestion}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
              >
                {suggestion}
              </Link>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Looking for a specific AI tool?{' '}
            <a 
              href="mailto:support@ai-feature-tracker.com" 
              className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:underline"
            >
              Contact us
            </a>
            {' '}to request it be added to our tracking list.
          </p>
        </div>
      </div>
    </div>
  );
}