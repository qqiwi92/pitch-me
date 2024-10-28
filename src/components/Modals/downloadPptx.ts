import { Slide } from "@/lib/types";
import PptxGenJS from "pptxgenjs";

export const downloadPptx = (list : Slide[], title: string) => {
  const pptx = new PptxGenJS();

  // Cover Slide
  const coverSlide = pptx.addSlide();
  coverSlide.addText(title, {
    x: 1,
    y: 1,
    fontSize: 36,
    bold: true,
    fontFace: "Montserrat",
  });

  // Content Slides
  list.forEach((slideData) => {
    const slide = pptx.addSlide();
    slide.addText(slideData.title, {
      x: 1,
      y: 0.5,
      fontSize: 24,
      bold: true,
    });

    slide.addText(slideData.richEditor, { x: 1, y: 1, fontSize: 18 });

    slideData.bulletPoints.forEach((point, index) => {
      slide.addText(`• ${point.text}`, {
        x: 1.5,
        y: 1.5 + index * 0.5, 
        fontSize: 16,
      });
    });
  });

  pptx.writeFile({ fileName: `${title}.pptx` });
};
