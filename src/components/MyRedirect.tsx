const debug = require("debug")("app:MyRedirect");

interface MyRedirectProps {
  url: string;
}

export default function MyRedirect(props: MyRedirectProps) {
  window.location.href = props.url;
  return null;
}
