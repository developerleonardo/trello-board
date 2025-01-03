import { useNavigate } from "react-router-dom"
import "./NotFound.css"

const NotFound = (): JSX.Element => {

  const navigate = useNavigate()

  const handleBackToHome = () => {
    navigate("/")
  }

  return (
    <div className="not-found">
      <p>Ops! 404 Error!</p>
      <h1>Page Not Found</h1>
      <button className="button primary-button" onClick={handleBackToHome}>Back to Home</button>
    </div>
  )
}

export { NotFound }