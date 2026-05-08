import { useState, useEffect } from "react";
import LunarButton from "./LunarButton";
import { useNavigate } from "react-router-dom";
//must setup state that ties into useAccount Call to userStatistics
export default function UserOverviewCard({ stats, user, statisticsloading }) {
  const [statsLoading, setStatsLoading] = useState(statisticsloading);
  const navigate = useNavigate();

  useEffect(() => {
    setStatsLoading(statisticsloading);
  }, [statisticsloading]);

  if (statsLoading && stats?.hasStatistics === true) {
    return (
      <div className="">
        <div className="bg-gray-700/10 rounded-lg p-6 max-w-2xl text-center justify-self-center text-amber-100 md:text-xl lg:text-lg font-mono animate-pulse mb-4">
          {/* Username skeleton */}
          <div className="h-12 w-40 bg-gray-800/40 rounded-lg mx-auto mb-4 animate-pulse"></div>

          {/* Activity Report skeleton */}
          <div className="h-8 w-32 bg-gray-800/40 rounded-lg mx-auto mb-6 animate-pulse"></div>

          <ul className="m-6 space-y-4">
            {/* Row 1 */}
            <li className="flex justify-between items-center border px-4 py-2 rounded-lg bg-linear-150 from-gray-800/70 to-gray-900/70">
              <span className="h-4 w-34 bg-gray-600/40 rounded"></span>
              <span className="h-16 w-24 bg-gray-600/40 rounded-2xl"></span>
            </li>

            {/* Row 2 */}
            <li className="flex justify-between items-center border px-4 py-3 rounded-lg bg-linear-150 from-gray-800/70 to-gray-900/70">
              <span className="h-4 w-42 bg-gray-600/40 rounded"></span>
              <span className="h-16 w-24 bg-gray-600/40 rounded-2xl"></span>
            </li>

            {/* Row 3 */}
            <li className="flex justify-between items-center border px-4 py-2 rounded-lg bg-linear-150 from-gray-800/70 to-gray-900/70">
              <span className="h-4 w-44 bg-gray-600/40 rounded"></span>
              <span className="h-16 w-24 bg-gray-600/40 rounded-2xl"></span>
            </li>
          </ul>
        </div>

        <LunarButton
          text={"Start Journaling"}
          onclick={() => navigate("/JournalSelect")}
        />
      </div>
    );
  }
  return (
    <div>
      {stats?.hasStatistics === true ? (
        <div className=" bg-gray-700/10 rounded-lg p-6 max-w-2xl text-center justify-self-center text-amber-100  animate-fadeIn md:text-xl lg:text-lg font-sans">
          <h2 className=" text-sm md:text-lg ">{user?.username}</h2>
          <h2 className=" text-sm md:text-lg ">Activity Report</h2>
          <ul className="mt-2 space-y-2">
            <li className="flex  items-center justify-baseline p-2 lg:px-4 lg:py-3 rounded-lg">
              <span className="text-sm  min-w-45  bg-linear-150 from-gray-800/70 to-gray-900/70 rounded-lg px-5 py-3 ">
                Entries this month
              </span>
              <span className="text-blue-200 text-sm border px-3 py-2 rounded-lg bg-linear-60 from-gray-700 to-gray-900 ms-5 me-3 ">
                {stats?.statistics.monthlyEntries}
              </span>
            </li>

            <li className="flex  items-center justify-between p-2 lg:px-4 lg:py-3 ">
              <span className="text-sm  me-2 min-w-45 bg-linear-150 from-gray-800/70 to-gray-900/70 rounded-lg px-5 py-3">
                Most common day
              </span>
              <span className="text-blue-200 text-sm border px-3 py-2 rounded-lg bg-linear-60 from-gray-700 to-gray-900 mx-3">
                {stats?.statistics.commonDay}
              </span>
            </li>

            <li className="flex items-center p-2 lg:px-4 lg:py-3 ">
              <span className=" text-sm  me-2 min-w-45 bg-linear-150 from-gray-800/70 to-gray-900/70 rounded-lg px-5 py-3">
                Most common mood{" "}
              </span>
              <span className="text-blue-200 text-sm border px-3 py-2 rounded-lg  bg-linear-60 from-gray-700 to-gray-900 mx-3">
                {stats?.statistics.commonMood}
              </span>
            </li>
          </ul>
          <LunarButton
            text={"Start Journaling"}
            onclick={() => {
              navigate("/JournalSelect");
            }}
          />
        </div>
      ) : (
        <div className="text-center">
          <h2 className="m-4 text-sm md:text-lg text-center text-amber-100 font-bold">
            {user?.username || "User"}
          </h2>
          <div
            name="welcomeNewUser"
            className="text-amber-100  text-sm md:text-lg "
          >
            <p>
              Welcome to Lunar, core journaling feature are free to use get
              started here
            </p>
          </div>
          <LunarButton
            text={"Start Journaling"}
            onclick={() => {
              navigate("/JournalSelect");
            }}
          />
        </div>
      )}
    </div>
  );
}
