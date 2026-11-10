import { useAuth } from "../context/AuthContext"

function ProfilePage() {
  return (
    <div>
      {JSON.stringify(user, null, 2)}
    </div>
  )
}

export default ProfilePage