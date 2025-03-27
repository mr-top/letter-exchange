import { useContext, useState } from "react";

import { UserContext } from "./utils/UserContext";

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

function Report({ profile }) {
  const { loggedDetails } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState({}); 
  const [reportDetails, setReportDetails] = useState('');

  async function report() {
    setLoading(true);

    const result = await axiosFetch(axios.post, '/report', { sourceId: loggedDetails.id, targetId: profile.id, reportDetails });
    if (result.success) {
      setDisplay({success: true, msg: 'Reported successfully'});
    } else {
      setDisplay({success: false, msg: 'Reporting failed'});
    }

    setLoading(false);
  }

  return (
    <dialog id="report_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Report {profile.username}</h3>
        <p className="py-4">Please provide details for this report</p>
        <textarea className="textarea w-full" placeholder="..." value={reportDetails} onChange={e => setReportDetails(e.currentTarget.value)}/>
        {typeof display.success === 'boolean' && <p className={`${display.success ? 'text-success' : 'text-error'}`}>{display.msg}</p>}
        <div className="modal-action">
          <button className="btn btn-warning" onClick={report} disabled={loading}>Report</button>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default Report;