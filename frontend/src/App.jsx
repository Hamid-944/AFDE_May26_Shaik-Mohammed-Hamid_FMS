import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ThemeProvider } from './context/ThemeContext'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { SubmitFeedback } from './pages/SubmitFeedback'
import { FeedbackList } from './pages/FeedbackList'
import { FeedbackDetails } from './pages/FeedbackDetails'
import { Search } from './pages/Search'
import { EtlPipeline } from './pages/EtlPipeline'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/submit" element={<SubmitFeedback />} />
              <Route path="/feedback" element={<FeedbackList />} />
              <Route path="/feedback/:id" element={<FeedbackDetails />} />
              <Route path="/search" element={<Search />} />
              <Route path="/etl" element={<EtlPipeline />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{ style: { borderRadius: 12, fontSize: 14 } }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
