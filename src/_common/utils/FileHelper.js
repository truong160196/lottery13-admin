import { formatNumber } from "remix-dls";

export function getMessageDateOrTime(date = null) {
  if (date !== null) {
    const dateObj = new Date(date);
    const dateDetails = {
      date: dateObj.getDate(),
      month: dateObj.getMonth() + 1,
      year: dateObj.getFullYear(),
      hour: dateObj.getHours(),
      minutes: dateObj.getMinutes(),
    };
    const currentDateObj = new Date();
    const currentDateDetails = {
      date: currentDateObj.getDate(),
      month: currentDateObj.getMonth() + 1,
      year: currentDateObj.getFullYear(),
      hour: currentDateObj.getHours(),
      minutes: currentDateObj.getMinutes(),
    };
    if (
      dateDetails.year !== currentDateDetails.year &&
      dateDetails.month !== currentDateDetails.month &&
      dateDetails.date !== currentDateDetails.date
    ) {
      return `${dateDetails.date} - ${dateDetails.month} - ${dateDetails.year}`;
    }
    return `${dateDetails.hour}:${dateDetails.minutes} ${
      dateDetails.hour < 12 ? "AM" : "PM"
    }`;
  }
  return "";
}

export function URLify(string) {
  const urls = string.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)/g);
  let result = string;

  if (urls) {
    urls.forEach(function(url) {
      result = result.replace(
        url,
        `<a target="_blank" href="${url}">${url}</a>`
      );
    });
  }
  return result.replace("(", "<br/>(");
}

export function checkFileType(file_name) {
  const imageType = ["jpeg", "jpg", "png", "gif"];
  const pdfType = ["pdf"];
  const docType = ["doc", "docx"];
  const excelType = ["xlsx", "csv", "txt", "xltx"];
  const zipType = ["zip", "rar"];
  const zipOther = ["apk", "psd", "ai", "sql"];
  const audioType = [
    "avi",
    "mov",
    "webm",
    "mp4",
    "m4p",
    "mpg",
    "mp2",
    "mpeg",
    "mpe",
    "mpv",
    "m4v",
    "svi",
  ];

  const fileNameSplit = file_name.split(".");
  const fileName = fileNameSplit[fileNameSplit?.length - 1];
  let type = "file";
  if (imageType.indexOf(fileName) > -1) {
    type = "image";
  } else if (pdfType.indexOf(fileName) > -1) {
    type = "pdf";
  } else if (docType.indexOf(fileName) > -1) {
    type = "word";
  } else if (excelType.indexOf(fileName) > -1) {
    type = "excel";
  } else if (zipType.indexOf(fileName) > -1) {
    type = "zip";
  } else if (audioType.indexOf(fileName) > -1) {
    type = "audio";
  } else if (zipOther.indexOf(fileName) > -1) {
    type = "other";
  }

  return type;
}

export function getControl(controls = [], key) {
  try {
    if (!key) return null;
    if (!Array.isArray(controls)) return null;

    const lstControl = controls.map((obj) => obj?.code);
    const index = lstControl.findIndex((obj) => obj === key);

    if (index === -1) return null;

    return controls[index];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function getControlByValue(controls = [], key, checkPermission = false) {
  try {
    if (!key) return null;
    if (!Array.isArray(controls)) return null;
    if (checkPermission) return true;

    const lstControl = controls.map((obj) => obj?.value);
    const index = lstControl.findIndex((obj) => obj === key);

    if (index === -1) return null;

    return controls[index];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const formatFileSize = (bytes) => {
  if (!bytes) return `0 KB`;
  const marker = 1024;
  const kiloBytes = marker;
  const megaBytes = marker * marker;
  const gigaBytes = marker * marker * marker;
  if (bytes < kiloBytes) return `${formatNumber(bytes)} Bytes`;
  if (bytes < megaBytes)
    return `${formatNumber(bytes / kiloBytes, "0.[0]")} KB`;
  if (bytes < gigaBytes)
    return `${formatNumber(bytes / megaBytes, "0.[00]")} MB`;
  return `${formatNumber(bytes / gigaBytes, "0.[00]")} GB`;
};
