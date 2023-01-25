onmessage = function (e) {
  // postMessage("hi");
  var { data, i, blocks, size } = e.data;
  var blockity = Object.keys(blocks);
  console.log("worker got message", data.length, i, blockity, size);
};

function koolaid({ data, i, blocks, size }) {
  for (var i = 0; i < data.length; i += 4) {
    var r = data[i],
      g = data[i + 1],
      b = data[i + 2],
      difference = {},
      block;
    // if ((r === 0, g === 0, b === 0)) continue;
    // console.log(!!blocks[[r, g, b].join()]);
    var short = [
      Math.floor(r / 6),
      Math.floor(g / 6),
      Math.floor(b / 6)
    ].join();
    if (caculated[short]) block = caculated[short];
    else if (!blocks[[r, g, b].join()]) {
      blockity.forEach((key) => {
        var colors = key.split(",").map((color) => parseInt(color, 10));
        var result =
          Math.abs(r - colors[0]) +
          Math.abs(g - colors[1]) +
          Math.abs(b - colors[2]);
        difference[result] = blocks[key];
      });
      block = difference[Object.keys(difference)[0]];
      caculated[short] = block;
    }
    var x = ((i + (howManyWorkers - 1) * amountDataSend) / 4) % size[0],
      y = Math.floor((i + (howManyWorkers - 1) * amountDataSend) / 4 / size[0]);
    var comma;
    var originx = x;
    var originy = y;
    if (centered) {
      x -= Math.floor(size[0] / 2);
      y -= Math.floor(size[1] / 2);
    }
    if (
      originx !== 0 &&
      commands2.length &&
      commands2[commands2.length - 1].match(block.id.replace("\\t", "\\\\t"))
    ) {
      var commandBefore = commands2[commands2.length - 1];
      // console.log(commandBefore);
      if (commandBefore.match("fill")) {
        comma = commandBefore.replace(`~${y}~${x - 1}`, `~${y}~${x}`);
        commands2.pop();
        // console.log(comma, commands2.pop());
        commands.pop();
        addCommand(comma);
        commands2[commands2.length] = comma;
      } else {
        comma = `fill~${x - 1}~BBB~${y}~${x}~BBB~${y}${block.id}`;
        commands2.pop();
        // console.log(comma, );
        commands.pop();
        addCommand(comma);
        commands2[commands2.length] = comma;
      }
    } else {
      comma = `setblock~${x}~BBB~${y}${block.id}`;
      var areaType =
        Math.floor(originx / areaSize) +
        Math.floor(originy / areaSize) * Math.ceil(size[0] / areaSize);
      if (!blocksArea[areaType]) blocksArea[areaType] = {};
      if (!blocksArea[areaType][block.id]) blocksArea[areaType][block.id] = 0;
      blocksArea[areaType][block.id]++;
      commands2.push(comma);
      addCommand(comma);
    }
    if (!originx && originy % sizeThing === 0) {
      console.log(comma, originy);
      tickareatesting.push([commands2.length - 1, comma]);
    }
    // console.log(x, y, block.id);
    // console.log(block.texture);
    // ctx.drawImage(
    //   block,
    //   originx * blockSize,
    //   originy * blockSize,
    //   blockSize,
    //   blockSize
    // );
  }
}
