import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Welcome to Soc.AI</h1>
        <p className="hero-text">
          Experience social media enhanced by artificial intelligence. Connect,
          share, and engage with AI-powered content generation and meaningful
          interactions.
        </p>
        <div className="hero-buttons">
          <Link to="/feed" className="btn btn-primary">
            View Feed
          </Link>
          <Link to="/profile" className="btn btn-secondary">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
