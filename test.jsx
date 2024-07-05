<Presentation>
  <Slide>
    <Text
      style={{
        x: 3.73,
        y: 1,
        w: 1,
        h: 1,
        fontSize: 72,
        fontFace: "Montserrat",
        bold: true,
      }}
    >
      Name of the project{" "}
    </Text>
  </Slide>
  {a.map((slide) => {
    return (
      <Slide>
        <Text
          style={{
            x: 3.73,
            y: 0.2,
            w: 3,
            h: 0.5,
            fontSize: 72,
            fontFace: "Montserrat",
            bold: true,
          }}
        >
          {slide.title}
        </Text>
        <Text style={{ x: 3.73, y: 2, w: 3, h: 0.5, fontSize: 32 }}>
          {slide.bulletPoints.map((p) => (
            <Text style={{ margin: 10 }}> {p.text} </Text>
          ))}
        </Text>
      </Slide>
    );
  })}
</Presentation>;
