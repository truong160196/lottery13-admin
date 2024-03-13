import moment from "moment";

export function getProcess(time_start, complete_time) {
  let process = 0;
  if (!time_start) return process;
  if (!complete_time) return process;

  try {
    const formatInputTime = "YYYY-MM-DD H:mm:ss";
    const dateStart = new Date(time_start * 1000);

    const currentTime = moment();
    const startTime = moment(dateStart, formatInputTime);
    // const endTime = startTime.add(complete_time, "hours");
    const fromNow = currentTime.diff(startTime, "minutes");

    const percent = (fromNow / (complete_time * 60)) * 100;

    process = Number(percent.toFixed(0));
  } catch (err) {
    console.error(err);
  }

  return process;
}

export const getTimeFinish = (timeStart, time_finish, complete_time) => {
  let count_time = "00:00:00";
  let checkTimeOut = false;

  try {
    if (timeStart && time_finish && complete_time) {
      const dateStart = new Date(timeStart * 1000);
      const dateFinish = new Date(time_finish * 1000);

      const time_start = moment(dateStart);
      const finishDate = moment(dateFinish);

      const diffTime = moment(finishDate).diff(time_start);
      const duration = moment.duration(diffTime);
      const fromNow = finishDate.diff(time_start, "hours");

      const day = duration.days();
      const hrs = duration.hours();
      const mins = duration.minutes();
      const secs = duration.seconds();

      if (day <= 0 && fromNow < complete_time) {
        const hourText = `0${hrs}`.substr(-2);
        const minText = `0${mins}`.substr(-2);
        const secText = `0${secs}`.substr(-2);

        count_time = `${hourText}:${minText}:${secText}`;
      } else {
        checkTimeOut = true;
        count_time = `${complete_time}:00:00`;
      }
    }
  } catch (err) {
    console.error(err);
  }

  return {
    count_time,
    checkTimeOut,
  };
};

export const formatTimeSecond = (seconds) => {
  try {
    const dateFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Etc/UTC",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return dateFormatter.format(new Date(seconds * 1000));
  } catch (err) {
    return `00:00:00`;
  }
};
