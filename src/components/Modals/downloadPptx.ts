import { Slide } from "@/lib/types";
import PptxGenJS from "pptxgenjs";

export const downloadPptx = (list: Slide[], title: string) => {
  const pptx = new PptxGenJS();

  // Cover Slide
  const coverSlide = pptx.addSlide();
  coverSlide.addText(title, {
    x: 1,
    y: 1,
    fontSize: 52,
    bold: true,
    align: "center",
    fontFace: "Montserrat",
    fill: {
      color: "060606",
    },
    margin: [5, 5, 10, 5],
    color: "ffffff",
  });
  coverSlide.color = "ffffff";
  coverSlide.background = { color: "060606" };
  // Content Slides
  list.forEach((slideData) => {
    const slide = pptx.addSlide();
    slide.addText(slideData.title, {
      x: 1,
      y: 0.5,
      fontSize: 24,
      bold: true,
      margin: [5, 5, 10, 5],
      underline: { style: "dash", color: "d373e7" },

      color: "ffffff",
    });

    slide.addText(slideData.richEditor, {
      x: 1,
      y: 1,
      fontSize: 18,
      margin: [5, 5, 5, 5],

      color: "ffffff",
    });

    slideData.bulletPoints.forEach((point, index) => {
      slide.addText(`• ${point.text}`, {
        x: 1.5,
        y: 1.5 + index * 0.5,
        fontSize: 16,
        color: "ffffff",
      });
    });
    slide.background = { color: "060606" };
    slide.color = "ffffff";
  });

  pptx.writeFile({ fileName: `${title}.pptx` });
};
