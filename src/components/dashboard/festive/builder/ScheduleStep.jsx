import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

export default function ScheduleStep({
  data = {},
  onChange,
}) {
  const [schedule, setSchedule] = useState({
    startDate: data.startDate || "",
    startTime: data.startTime || "",

    endDate: data.endDate || "",
    endTime: data.endTime || "",

    timezone:
      data.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone,

    autoPublish: data.autoPublish ?? true,
    autoRevert: data.autoRevert ?? true,

    notifyBefore: data.notifyBefore || "30",
  });

  const update = (field, value) => {
    const updated = {
      ...schedule,
      [field]: value,
    };

    setSchedule(updated);

    onChange?.(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h2 className="text-xl font-semibold">
          Schedule Festive Menu
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Configure when this festive menu should
          automatically go live and when it should
          switch back to your regular menu.
        </p>
      </div>

      {/* Publish */}

      <div className="rounded-xl border bg-white 900 border-slate-700 p-6">

        <div className="flex items-center gap-2 mb-5">

          <CalendarDays
            className="text-orange-500"
            size={20}
          />

          <h3 className="font-semibold">
            Publish Schedule
          </h3>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="block text-sm font-medium mb-2">
              Start Date
            </label>

            <input
              type="date"
              value={schedule.startDate}
              onChange={(e) =>
                update("startDate", e.target.value)
              }
              className="w-full rounded-lg border px-4 py-3 bg-transparent"
            />

          </div>

          <div>

            <label className="block text-sm font-medium mb-2">
              Start Time
            </label>

            <input
              type="time"
              value={schedule.startTime}
              onChange={(e) =>
                update("startTime", e.target.value)
              }
              className="w-full rounded-lg border px-4 py-3 bg-transparent"
            />

          </div>

        </div>

        <div className="mt-6 flex items-center justify-between rounded-lg border p-4">

          <div>

            <p className="font-medium">
              Auto Publish
            </p>

            <p className="text-sm text-slate-500">
              Publish automatically on schedule.
            </p>

          </div>

          <input
            type="checkbox"
            checked={schedule.autoPublish}
            onChange={(e) =>
              update(
                "autoPublish",
                e.target.checked
              )
            }
            className="h-5 w-5"
          />

        </div>

      </div>

      {/* End Schedule */}

      <div className="rounded-xl border bg-white 900 border-slate-700 p-6">

        <div className="flex items-center gap-2 mb-5">

          <RotateCcw
            className="text-green-600"
            size={20}
          />

          <h3 className="font-semibold">
            Revert Schedule
          </h3>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="block text-sm font-medium mb-2">
              End Date
            </label>

            <input
              type="date"
              value={schedule.endDate}
              onChange={(e) =>
                update("endDate", e.target.value)
              }
              className="w-full rounded-lg border px-4 py-3 bg-transparent"
            />

          </div>

          <div>

            <label className="block text-sm font-medium mb-2">
              End Time
            </label>

            <input
              type="time"
              placeholder="HH-MM-AM/PM"
              value={schedule.endTime}
              onChange={(e) =>
                update("endTime", e.target.value)
              }
              className="w-full rounded-lg border px-4 py-3 bg-transparent"
            />

          </div>

        </div>

        <div className="mt-6 flex items-center justify-between rounded-lg border p-4">

          <div>

            <p className="font-medium">
              Auto Revert
            </p>

            <p className="text-sm text-slate-500">
              Restore your regular menu when the
              festive period ends.
            </p>

          </div>

          <input
            type="checkbox"
            checked={schedule.autoRevert}
            onChange={(e) =>
              update(
                "autoRevert",
                e.target.checked
              )
            }
            className="h-5 w-5"
          />

        </div>

      </div>
            {/* Timezone */}

      <div className="rounded-xl border bg-white 900 border-slate-700 p-6">

        <div className="flex items-center gap-2 mb-5">
          <Clock3 className="text-blue-500" size={20} />
          <h3 className="font-semibold">
            Timezone & Notification
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="block text-sm font-medium mb-2">
              Timezone
            </label>

            <select
              value={schedule.timezone}
              onChange={(e) =>
                update("timezone", e.target.value)
              }
              className="w-full rounded-lg border px-4 py-3 bg-transparent"
            >
              <option value="Asia/Kolkata">
                Asia/Kolkata (IST)
              </option>

              <option value="UTC">
                UTC
              </option>

              <option value="America/New_York">
                America/New_York
              </option>

              <option value="Europe/London">
                Europe/London
              </option>

              <option value="Australia/Sydney">
                Australia/Sydney
              </option>

            </select>

          </div>

          <div>

            <label className="block text-sm font-medium mb-2">
              Notify Before
            </label>

            <select
              value={schedule.notifyBefore}
              onChange={(e) =>
                update("notifyBefore", e.target.value)
              }
              className="w-full rounded-lg border px-4 py-3 bg-transparent"
            >
              <option value="15">
                15 Minutes
              </option>

              <option value="30">
                30 Minutes
              </option>

              <option value="60">
                1 Hour
              </option>

              <option value="180">
                3 Hours
              </option>

              <option value="1440">
                1 Day
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* Warning */}

      <div className="rounded-xl border border-amber-300 bg-amber-50 -amber-900/10 border-amber-700 p-5">

        <div className="flex items-start gap-3">

          <AlertTriangle
            className="text-amber-500 mt-1"
            size={20}
          />

          <div>

            <h4 className="font-semibold">
              Schedule Reminder
            </h4>

            <p className="text-sm text-slate-600 text-slate-400 mt-1">
              Ensure your festive menu contains all
              required products before the publish
              time. Once published, customers will
              automatically see the festive menu.
            </p>

          </div>

        </div>

      </div>

      {/* Summary */}

      <div className="rounded-xl border bg-slate-50 900 border-slate-700 p-6">

        <h3 className="font-semibold mb-5">
          Schedule Summary
        </h3>

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="rounded-lg border p-4">

            <p className="text-sm text-slate-500">
              Publish
            </p>

            <h4 className="font-semibold mt-1">
              {schedule.startDate || " "}{" "}
              {schedule.startTime || " "}
            </h4>

            <p className="text-xs text-slate-500 mt-2">
              Auto Publish :
              {" "}
              {schedule.autoPublish
                ? " Enabled"
                : " Disabled"}
            </p>

          </div>

          <div className="rounded-lg border p-4">

            <p className="text-sm text-slate-500">
              Revert
            </p>

            <h4 className="font-semibold mt-1">
              {schedule.endDate || "--"}{" "}
              {schedule.endTime || "--"}
            </h4>

            <p className="text-xs text-slate-500 mt-2">
              Auto Revert :
              {" "}
              {schedule.autoRevert
                ? " Enabled"
                : " Disabled"}
            </p>

          </div>

        </div>

        <div className="mt-6 rounded-lg bg-orange-50 -orange-900/10 p-4 border border-orange-200 border-orange-800">

          <p className="text-sm">
            <strong>Timezone:</strong>{" "}
            {schedule.timezone}
          </p>

          <p className="text-sm mt-2">
            <strong>Notification:</strong>{" "}
            {schedule.notifyBefore} minutes before
            publishing.
          </p>

        </div>

      </div>

    </div>
  );
}