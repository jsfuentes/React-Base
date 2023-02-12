// Experimental function that might exist: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId
interface MyHTMLMediaElement extends HTMLMediaElement {
  setSinkId?: (id: string) => Promise<undefined>;
}
