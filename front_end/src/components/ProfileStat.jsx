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
          <td>{profile.joined_date || 'Unknown'}</td>
        </tr>
        <tr>
          <td>Letter reply rate</td>
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