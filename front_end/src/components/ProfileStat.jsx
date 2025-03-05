function ProfileStat({profile}) {
  return (
    <table className="flex-intitial table table-sm table-zebra">
      <tbody>
        <tr>
          <td>Date of birth</td>
          <td>{profile.dob || 'Unknown'}</td>
        </tr>
        <tr>
          <td>Joined date</td>
          <td>{(profile.joined_date && new Date(profile.joined_date).toLocaleDateString()) || 'Unknown'}</td>
        </tr>
        <tr>
          <td>Sent and received letters</td>
          <td>Todo</td>
        </tr>
        <tr>
          <td>Letter delivery estimate</td>
          <td>Todo</td>
        </tr>
        <tr>
          <td>Languages</td>
          <td>Swahili<br />English</td>
        </tr>
      </tbody>
    </table>
  )
}

export default ProfileStat;