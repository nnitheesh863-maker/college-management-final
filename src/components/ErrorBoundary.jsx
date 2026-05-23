import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-8">
          <div className="max-w-lg w-full rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-rose-400 mb-4">⚠️ Render Error</h2>
            <p className="text-rose-200 font-mono text-sm mb-4 whitespace-pre-wrap">{this.state.error.message}</p>
            <p className="text-slate-400 text-xs font-mono">{this.state.error.stack?.split('\n').slice(0, 3).join('\n')}</p>
            <button onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold hover:bg-rose-500/30"
            >Reload Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
