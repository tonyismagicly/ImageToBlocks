const image = document.querySelector("#image");
const screen = document.querySelector("#screen");
const ctx = screen.getContext("2d");
const input = document.querySelector("input");
let size = [75, 75];
let commands2 = [];
let blockSize = 16;
let data;
var randomName = "";
let nbt;
let caculated = {};
let centered = true;
let chars = "qwertyuiopasdfghjklzxcvbnm";
chars += chars.toUpperCase();
var nbtwrite = true;
let blocksArea = [];
let areaSize = 50;
let cbMinecartsPerTick = 20;
var tickareatesting = [];
var commands3 = [];
var sizeThing = 86;
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    console.log(input);
    reader.onload = function (e) {
      console.log(e);
      image.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}
function resizeToFitAspectRatio(maxsize = 75) {
  var divide =
    image.width > image.height ? maxsize / image.width : maxsize / image.height;
  size[0] = Math.floor(image.width * divide);
  size[1] = Math.floor(image.height * divide);
  sizeThing = Math.max(Math.floor(16000 / size[0] ** 1.05 - 16), 1);
  ihadabadcaseofdiaraheea(image);
}
function ihadabadcaseofdiaraheea(image) {
  randomName = "";
  commands = [];
  commands2 = [];
  blocksArea = [];
  ctx.clearRect(0, 0, image.width, image.height);
  ctx.fillRect(0, 0, image.width, image.height);
  ctx.drawImage(image, 0, 0, size[0], size[1]);
  data = ctx.getImageData(0, 0, size[0], size[1]).data;
  ctx.fillRect(0, 0, image.width, image.height);
  screen.width = size[0] * blockSize;
  screen.height = size[1] * blockSize;
  var blockity = Object.keys(blocks);
  cbMinecarts = [];
  addCBM("scoreboard objectives add test dummy", "scoreboard");
  addCBM(
    "scoreboard players add @e[r=3,type=!player,name=!tttttt] test 1",
    "tttttt"
  );
  addCBM("kill @e[scores={test=3..},name=!tttttt]", "tttttt");
  // addCBM("execute @e[name=tttttt] ~ ~ ~ tp @s ~ ~ ~", "tttttt");
  addCBM(`tickingarea remove_all`, "abc123", 1);
  addCBM(`say starting`);

  // var howbigtickarea = Math.floor(
  //   Math.min((16 * 16 * 100) / size[0] - 3, size[0] / 1.9)
  // );
  // var howbigtickarea = Math.ceil(size[1] / 10);
  tickareatesting = [];
  // var howbigtickarea = 16000 / size[0];
  // for (var y = 0; y < size[1]; y += howbigtickarea) {
  //   var x = 0;
  //   var yy = y;
  //   if (centered) {
  //     x -= Math.floor(size[0] / 2);
  //     yy -= Math.floor(size[1] / 2);
  //   }
  //   var tickingarea = `tickingarea add ~${x} ~ ~${yy} ~${x + size[0] + 1} ~ ~${
  //     yy + howbigtickarea
  //   } Area${y}`;
  //   // addCommand(tickingarea);
  //   addCBM(`say added ${tickingarea}`, "", Math.ceil(100 + y / size[1]));
  //   addCBM(tickingarea, "", Math.ceil(100 + y / size[1]));
  //   console.log("ticking area", tickingarea);
  //   // console.log(originx, originy, x, y);
  // }
  data = [...data];
  var howManyWorkers = 8;
  var tester = data.length / 8;
  // var data5 = JSON.parse(JSON.stringify(data));
  var amountDataSend = tester - (tester % 4);
  for (var i = 0, old; i < howManyWorkers - 1; i++) {
    var worker = new Worker("worker.js");
    worker.onmessage = (e) => {
      var message = e.data;
      alert(message);
      console.log("message from worker", message);
    };
    worker.postMessage({
      i,
      data: data.splice(0, amountDataSend),
      blocks,
      size
    });
    old += tester;
  }

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
    ctx.drawImage(
      block,
      originx * blockSize,
      originy * blockSize,
      blockSize,
      blockSize
    );
  }
  blocksArea = blocksArea.map((area) => Object.keys(area)[0]);
  blocksArea.forEach((a, index) => {});
  npcs = [];

  for (var i = 0; i < 6 + Math.floor(Math.random() * 5); i++) {
    randomName += chars[Math.floor(Math.random() * chars.length)];
  }
  console.log(randomName);
  commands3 = [];
  // do {
  //   commands3 = [];
  //   while (commands.length > 265) commands3.push(commands.pop());
  //   addNpc(commands);
  //   commands = commands3;
  // } while (commands3.length);.replace("\"","")
  var tickarea = 0;
  console.log(commands2);
  while (commands2.length) {
    var cMD = commands2.shift();
    if (tickareatesting?.[0]?.[0] === commands3.length) {
      // addCBM(`say starting ${sizeThing * tickarea}`);
      var tickareaCMD = `tickingarea add ~${Math.floor(
        size[0] / 2
      )} ~ ~${Math.floor(-size[1] / 2 + sizeThing * tickarea)} ~${Math.floor(
        -size[0] / 2
      )} ~ ~${Math.floor(
        -size[1] / 2 + sizeThing * (tickarea + 1) - 1
      )} Area${tickarea}`;
      addCBM(tickareaCMD, "a", 80 - 3);
      addCBM("say adding tick area " + tickareaCMD, "a", 80 - 3);
      tickarea++;
      if (tickarea >= 9) {
        addCBM(`tickingarea remove Area${tickarea - 9}`, "a", 80 - 5);
        addCBM(`say removing tick area Area${tickarea - 9}`, "a", 80 - 5);
      }
      console.log(tickareaCMD, cMD, commands3.length, tickareatesting.shift());
    }
    addCBM(cMD);
    commands3.push(cMD);
    // sizasdfe += commands3[commands3.length - 1].length + 3;
    // if (sizasdfe >= 30000 + npcNbt.length - 5) {
    //   addNpc(commands3);
    //   console.log(commands3.length);
    //   commands3 = [];
    //   sizasdfe = 0;
    // } else if (!commands2.length) addNpc(commands3);
  }
  // addCBM("tp @e[r=5,type=!player] ~ -1090 ~", "tttttt", 90);
  let npcs3 = [];
  console.log(npcs.length);

  // while (npcs.length > 15) npcs.pop();
  //${npcs.join(",")}
  let tag = `{ench:[{id:28s,lvl:1s}],Occupants:[npcs]}`
    .replace("npcs", npcs.join(","))
    .split("~0")
    .join("~");
  nbt = nbtwrite
    ? tag
    : `{Count:1b,Damage:0s,Name:"minecraft:beehive",WasPickedUp:0b,tag:${tag}}`;
  let tag2 = `{display:{Name:"${input.files[0].name.split('"').join("'")} (${
    size[0]
  }x${size[1]})",Lore:["${
    cbMinecarts.length
  }","Command Block Minecarts"]},Occupants:[${cbMinecarts.join()}]}`
    .split("\t")
    .join(" ")
    .split("\\t")
    .join(" ")
    .split("BBB")
    .join("-1");
  console.log(nbt.split("BBB").join("-1"));
  console.log(tag2);
}
function commandsToBeehive(commands2) {
  randomName = "";
  for (var i = 0; i < 6 + Math.floor(Math.random() * 5); i++) {
    randomName += chars[Math.floor(Math.random() * chars.length)];
  }
  commands = [];
  commands2.forEach((command) => addCommand(command));
  var commands3 = [];
  npcs = [];
  var sizasdfe = 0;
  while (commands.length) {
    commands3.push(commands.pop());
    sizasdfe += commands3[commands3.length - 1].length + 3;
    if (sizasdfe >= 30000 + npcNbt.length - 5) {
      addNpc(commands3);
      console.log(commands3.length);
      commands3 = [];
      sizasdfe = 0;
    } else if (!commands.length) addNpc(commands3);
  }
  let npcs3 = [];
  console.log(npcs.length);
  let tag = `{ench:[{id:28s,lvl:1s}],Occupants:[npcs]}`
    .replace("npcs", npcs.join(","))
    .split("~0")
    .join("~");
  nbt = nbtwrite
    ? tag
    : `{Count:1b,Damage:0s,Name:"minecraft:beehive",WasPickedUp:0b,tag:${tag}}`;
  return nbt;
}
let command = `        {
            "cmd_line":"",
            "cmd_ver" : 12
        }`;
let npcs = [];
let cbMinecarts = [];
let npcNbt = `{ActorIdentifier:"minecraft:npc<>",SaveData:{Actions:"[
    {
       "button_name":"Build",
       "data" : [
commands,
${command.replace(`"cmd_line":""`, `"cmd_line":"tp\\t@s\\t~\\t-2\\t~"`)}
       ],
       "mode":2,
       "text":"testing",
       "type":1
    },
    {
       "button_name" : "KillSelf",
       "data" : [
          {
             "cmd_line" : "kill@s",
             "cmd_ver" : 12
          }
       ],
       "mode" : 0,
       "text" : "kill@s",
       "type" : 1
    }
 ]
 ",CustomName:"Yes",CustomNameVisible:1b,InterativeText:"Yes",definitions:["+minecraft:npc"],identifier:"minecraft:npc"}}`;
let commandBlockMinecartNbt = `{ActorIdentifier:p,SaveData:{Command:CMD,Pos:[],Ticking:1b,identifier:command_block_minecart},TicksLeftToStay:TIMELEFT}`;
var commands = [];

let teypsdfofasdf = [
  {
    damage: 0,
    block: "wool",
    // color: { r: 232, g: 235, b: 236 },
    texture: "white_wool.png"
  },
  {
    damage: 1,
    block: "wool",
    // color: { r: 239, g: 117, b: 18 },
    texture: "orange_wool.png"
  },
  {
    damage: 2,
    block: "wool",
    // color: { r: 188, g: 68, b: 179 },
    texture: "magenta_wool.png"
  },
  {
    damage: 3,
    block: "wool",
    // color: { r: 57, g: 174, b: 216 },
    texture: "light_blue_wool.png"
  },
  {
    damage: 4,
    block: "wool",
    // color: { r: 248, g: 177, b: 18 },
    texture: "yellow_wool.png"
  },
  {
    damage: 5,
    block: "wool",
    // color: { r: 111, g: 184, b: 25 },
    texture: "lime_wool.png"
  },
  {
    damage: 6,
    block: "wool",
    // color: { r: 111, g: 184, b: 25 },
    texture: "pink_wool.png"
  },
  {
    damage: 7,
    block: "wool",
    // color: { r: 111, g: 184, b: 25 },
    texture: "gray_wool.png"
  },
  {
    damage: 8,
    block: "wool",
    // color: { r: 111, g: 184, b: 25 },
    texture: "light_gray_wool.png"
  },
  {
    damage: 9,
    block: "wool",
    // color: { r: 111, g: 184, b: 25 },
    texture: "cyan_wool.png"
  },
  {
    damage: 10,
    block: "wool",
    // color: { r: 111, g: 184, b: 25 },
    texture: "purple_wool.png"
  },
  {
    damage: 11,
    block: "wool",
    // color: { r: 111, g: 184, b: 25 },
    texture: "blue_wool.png"
  },
  {
    damage: 12,
    block: "wool",
    // color: { r: 111, g: 184, b: 25 },
    texture: "brown_wool.png"
  },
  {
    damage: 13,
    block: "wool",
    // color: { r: 111, g: 184, b: 25 },
    texture: "green_wool.png"
  },
  {
    damage: 14,
    block: "wool",
    // color: { r: 111, g: 184, b: 25 },
    texture: "red_wool.png"
  },
  {
    damage: 15,
    block: "wool",
    // color: { r: 111, g: 184, b: 25 },
    texture: "black_wool.png"
  },
  {
    damage: 0,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "white_concrete.png"
  },
  {
    damage: 1,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "orange_concrete.png"
  },
  {
    damage: 2,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "magenta_concrete.png"
  },
  {
    damage: 3,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "light_blue_concrete.png"
  },
  {
    damage: 4,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "yellow_concrete.png"
  },
  {
    damage: 5,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "lime_concrete.png"
  },
  {
    damage: 6,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "pink_concrete.png"
  },
  {
    damage: 7,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "gray_concrete.png"
  },
  {
    damage: 8,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "light_gray_concrete.png"
  },
  {
    damage: 9,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "cyan_concrete.png"
  },
  {
    damage: 10,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "purple_concrete.png"
  },
  {
    damage: 11,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "blue_concrete.png"
  },
  {
    damage: 12,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "brown_concrete.png"
  },
  {
    damage: 13,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "green_concrete.png"
  },
  {
    damage: 14,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "red_concrete.png"
  },
  {
    damage: 15,
    block: "concrete",
    // color: { r: 111, g: 184, b: 25 },
    texture: "black_concrete.png"
  },
  {
    damage: 0,
    block: "coal_block",
    // color: { r: 111, g: 184, b: 25 },
    texture: "coal_block.png"
  },
  {
    damage: 0,
    block: "copper_block",
    // color: { r: 111, g: 184, b: 25 },
    texture: "copper_block.png"
  },
  {
    damage: 0,
    block: "diamond_block",
    // color: { r: 111, g: 184, b: 25 },
    texture: "diamond_block.png"
  },
  {
    damage: 0,
    block: "emerald_block",
    // color: { r: 111, g: 184, b: 25 },
    texture: "emerald_block.png"
  },
  {
    damage: 0,
    block: "gold_block",
    // color: { r: 111, g: 184, b: 25 },
    texture: "gold_block.png"
  },
  {
    damage: 0,
    block: "nether_wart_block",
    // color: { r: 111, g: 184, b: 25 },
    texture: "nether_wart_block.png"
  },
  {
    damage: 0,
    block: "netherite_block",
    // color: { r: 111, g: 184, b: 25 },
    texture: "netherite_block.png"
  },
  {
    damage: 0,
    block: "tnt",
    // color: { r: 111, g: 184, b: 25 },
    texture: "tnt_top.png"
  },
  {
    damage: 0,
    block: "stripped_warped_stem",
    // color: { r: 111, g: 184, b: 25 },
    texture: "stripped_warped_stem_top.png"
  },
  {
    damage: 0,
    block: "sandstone",
    // color: { r: 111, g: 184, b: 25 },
    texture: "sandstone_top.png"
  },
  {
    damage: 0,
    block: "purpur_block",
    // color: { r: 111, g: 184, b: 25 },
    texture: "purpur_pillar_top.png"
  },
  {
    damage: 0,
    block: "planks",
    // color: { r: 111, g: 184, b: 25 },
    texture: "oak_planks.png"
  },
  {
    damage: 1,
    block: "planks",
    // color: { r: 111, g: 184, b: 25 },
    texture: "spruce_planks.png"
  },
  {
    damage: 2,
    block: "planks",
    // color: { r: 111, g: 184, b: 25 },
    texture: "birch_planks.png"
  },
  {
    damage: 3,
    block: "planks",
    // color: { r: 111, g: 184, b: 25 },
    texture: "jungle_planks.png"
  },
  {
    damage: 4,
    block: "planks",
    // color: { r: 111, g: 184, b: 25 },
    texture: "acacia_planks.png"
  },
  {
    damage: 5,
    block: "planks",
    // color: { r: 111, g: 184, b: 25 },
    texture: "dark_oak_planks.png"
  },
  {
    damage: 0,
    block: "warped_planks",
    // color: { r: 111, g: 184, b: 25 },
    texture: "warped_planks.png"
  },
  {
    damage: 0,
    block: "crimson_planks",
    // color: { r: 111, g: 184, b: 25 },
    texture: "crimson_planks.png"
  },
  {
    damage: 0,
    block: "clay",
    // color: { r: 111, g: 184, b: 25 },
    texture: "clay.png"
  },
  {
    damage: 0,
    block: "red_sandstone",
    // color: { r: 111, g: 184, b: 25 },
    texture: "red_sandstone_top.png"
  },
  {
    damage: 0,
    block: "sandstone",
    // color: { r: 111, g: 184, b: 25 },
    texture: "sandstone_top.png"
  },
  {
    damage: 0,
    block: "snow",
    // color: { r: 111, g: 184, b: 25 },
    texture: "snow.png"
  },
  {
    damage: 0,
    block: "smooth_stone",
    // color: { r: 111, g: 184, b: 25 },
    texture: "smooth_stone.png"
  },
  {
    damage: 0,
    block: "stone",
    // color: { r: 111, g: 184, b: 25 },
    texture: "stone.png"
  },
  {
    damage: 0,
    block: "crimson_nylium",
    // color: { r: 111, g: 184, b: 25 },
    texture: "crimson_nylium.png"
  },
  {
    damage: 0,
    block: "packed_ice",
    // color: { r: 111, g: 184, b: 25 },
    texture: "packed_ice.png"
  },
  {
    damage: 0,
    block: "blue_ice",
    // color: { r: 111, g: 184, b: 25 },
    texture: "blue_ice.png"
  }
];

let blocks = {};
var imageLoaderCanvas = document.createElement("canvas");
var imageLoader = imageLoaderCanvas.getContext("2d");
imageLoaderCanvas.width = 16;
imageLoaderCanvas.height = 16;
teypsdfofasdf.forEach((block) => {
  const block2 = block;
  var id = block.damage ? `${block.block}\\t${block.damage}` : `${block.block}`;
  var imgSrc =
    localStorage.getItem("blocks/" + block.texture) ||
    "blocks/" + block.texture;
  var image = document.createElement("img");
  image.src = imgSrc;
  image.id = id;
  image.width = 16;
  image.height = 16;
  image.crossOrigin = "anonymous";
  document.body.appendChild(image);
  if (!block.color) {
    image.onload = function () {
      imageLoader.drawImage(image, 0, 0, image.width, image.height);
      var data = imageLoader.getImageData(0, 0, image.width, image.height).data;
      var r = 0,
        g = 0,
        b = 0,
        times = 0;
      for (var i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        times++;
      }
      // console.log(r, g, b, times);
      r = Math.floor(r / times);
      g = Math.floor(g / times);
      b = Math.floor(b / times);
      console.log(r, g, b, block.texture);
      blocks[[r, g, b].join()] = image;
      localStorage.setItem(
        "blocks/" + block2.texture,
        imageLoaderCanvas.toDataURL()
      );
    };
  } else {
    var c = block.color;
    blocks[[c.r, c.g, c.b].join()] = image;
  }
});
function addCommand(commanding) {
  commands.push(command.replace(`"cmd_line":""`, `"cmd_line":"${commanding}"`));
}
function addCBM(cmd, name, offset = 0) {
  var commandBlockMinecart = commandBlockMinecartNbt
    .replace("CMD", cmd.indexOf(" ") + 1 ? `"${cmd}"` : cmd)
    .replace(
      "TIMELEFT",
      Math.floor(cbMinecarts.length / cbMinecartsPerTick + !name * 80 + offset)
    );
  if (name)
    (commandBlockMinecart = commandBlockMinecart.replace(
      "SaveData:{",
      `SaveData:{CustomName:${name.indexOf(" ") + 1 ? `"${name}"` : name},`
    )),
      console.log(name);
  cbMinecarts.push(commandBlockMinecart);
}
function addNpc(commands) {
  var npc = npcNbt;
  npc = npc.replace("commands", commands.join(",\n"));
  npc = npc.replace("Yes", randomName).replace("Yes", randomName);
  npcs.push(npc);
}
console.log("done load");
