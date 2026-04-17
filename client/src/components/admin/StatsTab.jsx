import StatPill from "./sidebar/StatPill";
import MiniBar from "./MiniBar";
import SidebarCard from "./sidebar/SidebarCard";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const StatsTab = ({ analytics }) => {
  if (!analytics) return null;
  const { bookings, users, trends } = analytics;
  const maxMonthly = Math.max(...(trends?.monthly?.map((m) => m.count) || [1]));

  return (
    <div className="space-y-4">
      {/* Overview */}
      <SidebarCard title="Bookings Overview">
        <StatPill label="Total" value={bookings.total} color="#d4b86a" />
        <StatPill label="Pending" value={bookings.pending} color="#f59e0b" />
        <StatPill
          label="Confirmed"
          value={bookings.confirmed}
          color="#10b981"
        />
        <StatPill label="Declined" value={bookings.declined} color="#ef4444" />
      </SidebarCard>

      {/* Period */}
      <SidebarCard title="Period Stats">
        <StatPill label="Today" value={bookings.today} color="#6366f1" />
        <StatPill label="This Week" value={bookings.thisWeek} color="#8b5cf6" />
        <StatPill
          label="This Month"
          value={bookings.thisMonth}
          color="#7c5546"
        />
      </SidebarCard>

      {/* By category */}
      {bookings.byCategory?.length > 0 && (
        <SidebarCard title="By Category">
          {bookings.byCategory.map(({ _id, count }) => (
            <MiniBar
              key={_id}
              label={_id}
              count={count}
              total={bookings.total}
            />
          ))}
        </SidebarCard>
      )}

      {/* Users */}
      <SidebarCard title="Users">
        <StatPill label="Total Users" value={users.total} color="#d4b86a" />
        <StatPill
          label="New This Month"
          value={users.newThisMonth}
          color="#10b981"
        />
      </SidebarCard>

      {/* Monthly trend */}
      {trends?.monthly?.length > 0 && (
        <SidebarCard title="Monthly Trend (6 months)">
          {trends.monthly.map(({ _id, count }) => (
            <MiniBar
              key={`${_id.year}-${_id.month}`}
              label={`${MONTH_NAMES[_id.month - 1]} ${String(_id.year).slice(2)}`}
              count={count}
              total={maxMonthly}
              color="#d4b86a"
            />
          ))}
        </SidebarCard>
      )}
    </div>
  );
};

export default StatsTab;
