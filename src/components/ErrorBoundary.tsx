import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('BreadBook error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-crumb flex items-center justify-center p-6">
          <div className="bg-steam border border-dough rounded-2xl p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-char mb-3">Something went wrong</h1>
            <p className="text-ash mb-6">
              Don't worry — your bake data is safe. Try refreshing the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.href = '/'
              }}
              className="bg-crust text-steam px-6 py-2.5 rounded-xl font-medium hover:bg-crust-light transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
