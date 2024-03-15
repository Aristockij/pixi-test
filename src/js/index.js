import { Application, Assets,Text, Container, Sprite, DisplacementFilter } from 'pixi.js';
import * as FILTER from 'pixi-filters';
import img from '../../public/cosmos.jpg';
import disp from '../../public/displacement.png';
import noise from '../../public/noise.png';
import { gsap } from "gsap";


const app = new Application();

(async () => {

    let height = window.innerHeight;
    let width = window.innerWidth;

    await app.init({ background: 'black', resizeTo: window });

    document.body.appendChild(app.canvas);

    const containerBg = new Container();
    const containerText = new Container();


    const texture = await Assets.load(img);
    const displacementLoad = await Assets.load(disp);

    const sprite = new Sprite(texture);
    const displacementSprite = Sprite.from(displacementLoad);
          displacementSprite.texture.wrapMode = 'repeat';

    const displacementFilter = new DisplacementFilter({
        sprite: displacementSprite,
        scale: {
            x: 50,
            y: 50
        }
    });

    const twist = new FILTER.TwistFilter({
        angle:0,
        radius: 0,
        offset:{
            x: window.innerWidth/2,
            y: window.innerHeight/2
        }
    });

    displacementSprite.anchor.set(0.5);

    sprite.width = width;
    sprite.height= height;

    app.stage.addChild(containerBg);
    containerBg.addChild(sprite);

    const shock = new FILTER.ShockwaveFilter({
        speed: 2000,
        radius: 2000,
        amplitude: 50,
        wavelength:190,
        brightness: 1,
    });

    const basicText = new Text({
        text: 'Click me',
        style: {
            fontFamily: 'Arial',
            fontSize: 136,
            fill: 'white',
            align: 'center',
            alpha: 0
        }
    });

    containerBg.filters = [ shock, twist];

    app.stage.addChild(containerText);
    containerText.addChild(basicText);


    basicText.filters = [displacementFilter];

    basicText.x = -550;
    basicText.y = 100;


    displacementFilter.padding = 10;
    displacementSprite.width = sprite.width;
    displacementSprite.position = sprite.position;

    containerText.addChild(displacementSprite)

    containerBg.eventMode = 'static';
    containerBg.cursor = 'pointer';

    containerBg.on('pointerdown', shockWaveEvent);

    function shockWaveEvent(e){
        shock.center.x = e.client.x;
        shock.center.y = e.client.y;

        let tl = gsap.timeline();
            tl.fromTo(shock, 4, {
                time: 0
            },{
                time: 1
            });

            console.log(shock);

        return tl;
    }




    // app.ticker.add(() => {
    //     displacementSprite.x++;
    // });

    // let tl = gsap.timeline();
    // tl
    //     .to(shock,3,{time: 1})
    //     .to(displacementFilter.scale, {x:0, y:0, duration: 1})
    //     .to(basicText.position, {x:50, duration: 1}, '<')
    //     .to(basicText, {alpha: 1, duration: 1}, '<')
    //     .to(twist,2, {angle: 20, radius: 200 })

    // document.body.addEventListener('click',(e)=>{
    //     let tl = gsap.timeline();
    //     tl
    //         .to(displacementFilter.scale, {x:50, y:50, duration: 1})
    //         .to(basicText.position, {x:200, duration: 1}, '<')
    //         .to(basicText, {alpha: 0, duration: 1}, '<')
    // });




})();
