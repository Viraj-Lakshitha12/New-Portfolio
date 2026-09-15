import * as React from "react"

/**
 * Simple Image component - a plain forwardRef <img> wrapper.
 * Replaces Base44's complex Wix Media Platform pipeline.
 * 
 * @type {React.ForwardRefExoticComponent<React.ImgHTMLAttributes<HTMLImageElement> & React.RefAttributes<HTMLImageElement>>}
 */
const Image = React.forwardRef((props, ref) => {
  return <img ref={ref} {...props} />
})
Image.displayName = "Image"

export { Image }
