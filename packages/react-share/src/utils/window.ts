export const openShareWindow = (url: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const width = 600;
  const height = 600;
  // System-compliant centering logic or just simple popup
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  window.open(
    url,
    "_blank",
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}, noopener, noreferrer`,
  );
};
