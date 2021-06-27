interface CreateThing{
        mainDom:HTMLElement
        canvas:HTMLElement | any
    }
interface stackImage{
    name:string
    id:number
    x:number
    y:number
    width:number
    height:number
}
interface isFill{
    flag:boolean
    color:string
}
interface rectDraw{
    pen:object
    rectData:rectData
}
interface rectData{
    isFill:isFill
    width:number
    height:number
    color:string
    x:number
    y:number
    id:number
}
    class NtI implements CreateThing{
        id:number = 0
        mainDom:HTMLElement
        canvas:HTMLElement | any
        pen:any
        x:number
        y:number
        width:number
        height:number
        blurOffset:number
        up:string
        down:string
        left:string
        right:string
        isFill:any
        stackX:Array<number> = []
        stackY:Array<number> = []
        stackImage:Array<object> = []
        resultX:number = 0
        resultY:number = 0
        circleX:number
        circleY:number
        radius:number
        upEdge:number
        rightEdge:number
        downEdge:number
        leftEdge:number
        isRect:boolean = false
        isCircle:boolean = false
        /* 变量全局存储 */
        constructor(dom:HTMLElement){
            const width = window.innerWidth / 2
            const height = window.innerHeight / 2
            this.mainDom = dom
            this.canvas = document.createElement('canvas')
            this.canvas.width = width
            this.canvas.height = height
            this.canvas.style.border = '1px solid black'
            this.pen = this.canvas.getContext('2d')
            dom.appendChild(this.canvas)
        }
        /* 
         @params
            isFill传入一个对象。该对象中的flag判断是否填充颜色，color为填充颜色
            x，y分别为矩形坐标，width height为长宽，color为笔触颜色，blurColor为阴影颜色blurOffset为阴影偏移
        */
        rectDraw(isFill:any,x:number,y:number,width:number,height:number,color:string,blur:any,blurColor:any,blurOffset:number):object{
            this.id += 1
            const rectData = {isFill,name:'rect',id:this.id,x,y,width,height,color}
            this.stackImage.push(rectData)
            this.x = x
            this.y = y
            this.width = width
            this.height = height
            this.blurOffset = blurOffset
            this.isFill = isFill
            if(!isFill.flag){
            this.pen.rect(x,y,width,height)
            this.pen.strokeStyle = color
            if(!blur){
                this.pen.stroke()
            }else{
                this.pen.shadowBlur = blur
                this.pen.shadowOffsetX = blurOffset
                this.pen.shadowColor = blurColor
                this.pen.stroke()
            }
        }else{
            this.pen.strokeStyle = color
            this.pen.fillStyle = isFill.color
            if(!blur){
                this.pen.fillRect(x,y,width,height)
            }else{
                this.pen.shadowBlur = blur
                this.pen.shadowOffsetX = blurOffset
                this.pen.shadowColor = blurColor
                this.pen.fillRect(x,y,width,height)
        }
        }
        return {pen:this.pen,rectData}
    }
    /* 
        接收参数的顺序为上右下左
    */
    keyboardBindRect(up:string,right:string,down:string,left:string,distance:number,rectData:object){
        for(const key in this.stackImage){
            if((this.stackImage[key] as stackImage).name === 'rect'){
                this.isRect = true
            }
        }
        if(!this.isRect){
            console.error('what you have create is not a rect')
        }else{
        this.up = up
        this.down = down
        this.right = right
        this.left = left
        this.pen.shadowBlur = 0
        this.pen.shadowOffsetX = 0
        this.pen.shadowColor = 'transparent'
        document.addEventListener('keyup',(event):void=>{
            event.preventDefault()
            const input = event.key
            let resultX = 0
            let resultY = 0
            for(const key in this.stackX){
                resultX += this.stackX[key]
            }
            for(const key in this.stackY){
                resultY += this.stackY[key]
            }
            if(input === up){
                /* up逻辑 */
                const maxY = this.y
                this.stackX.push(0)
                this.stackY.push(-distance)
                if(resultY <= -maxY){
                    this.stackY.push(distance)
                }else{
                this.rectMove(up,distance,rectData)
                }
            }else if(input === right){
                const maxX = this.canvas.width - this.x 
                this.stackX.push(distance)
                this.stackY.push(0)
                if(resultX >= maxX-this.width){
                    /* 右边界最大值为 this.canvas.width - this.x -this.width */
                    this.stackX.push(-distance) 
                }else{
                this.rectMove(right,distance,rectData)
                }
            }else if(input === down){
                const minY = this.canvas.height - this.y
                this.stackX.push(0)
                this.stackY.push(distance)
                if(resultY >= minY - Math.ceil(this.height)){
                    /* 下边界最大this.canvas.height - this.y - this.height - */
                    this.stackY.push(-distance)
                }else{
                this.rectMove(down,distance,rectData)
                }
            }else if(input === left){
                const minX = this.x
                this.stackX.push(-distance)
                this.stackY.push(0)
                if(resultX <= -minX){
                    /* 左边距 -this.x */
                    this.stackX.push(distance)
                }else{
                    this.rectMove(left,distance,rectData)
                }
            }
        })
    }
    }
    rectMove(direction:string,distance:number,rectData:object):void{
        for(const key in this.stackImage){
            if((this.stackImage[key] as stackImage).name === 'rect'){
                this.isRect = true
            }
        }
        if(!this.isRect){
            console.error('what you have create is not a rect')
        }else{
        this.pen.clearRect((rectData as rectData).x - 2,(rectData as rectData).y - 2,(rectData as rectData).width + 4,(rectData as rectData).height + 4)
        switch(direction){
            case this.up:{
                this.pen.translate(0,-distance)
                this.pen.fillRect((rectData as rectData).x,(rectData as rectData).y,(rectData as rectData).width,(rectData as rectData).height)
            } break;
            case this.right:{
                this.pen.translate(distance,0)
                this.pen.fillRect((rectData as rectData).x,(rectData as rectData).y,(rectData as rectData).width,(rectData as rectData).height)
            } break;
            case this.down:{
                this.pen.translate(0,distance)
                this.pen.fillRect((rectData as rectData).x,(rectData as rectData).y,(rectData as rectData).width,(rectData as rectData).height)
            } break;
            case this.left:{
                this.pen.translate(-distance,0)
                this.pen.fillRect((rectData as rectData).x,(rectData as rectData).y,(rectData as rectData).width,(rectData as rectData).height)
            } break;
        }
    }
}
    mouseBindRect(rectData:rectData){
        for(const key in this.stackImage){
            if((this.stackImage[key] as stackImage).name === 'rect'){
                this.isRect = true
            }
        }
        if(!this.isRect){
            console.error('what you have create is not a rect')
        }else{
            let localRectData = rectData
            this.upEdge = 0
            this.rightEdge = this.canvas.width - this.width
            this.leftEdge = 0
            this.downEdge = this.canvas.height - this.height
            this.canvas.addEventListener('mousedown',(event:any):void=>{
            event.preventDefault()
            let coordinateX:number = 0
            let coordinateY:number = 0
            for(const key in this.stackX){
                this.resultX += this.stackX[key] 
            }
            for(const key in this.stackY){
                this.resultY += this.stackY[key]
            }
            this.pen.clearRect(localRectData.x - 2,localRectData.y - 2,localRectData.width + 4,localRectData.height + 4)
            this.pen.translate(-this.resultX,-this.resultY)
            this.pen.clearRect(localRectData.x - 2,localRectData.y - 2,localRectData.width + 4,localRectData.height + 4)
            /* 边界处理 */
            if(event.offsetX >= this.rightEdge){
                coordinateX = this.rightEdge
                coordinateY = event.offsetY
            } else if(event.offsetY >= this.downEdge){
                coordinateX = event.offsetX
                coordinateY = this.downEdge
            }
            else{
                coordinateX = event.offsetX
                coordinateY = event.offsetY
            }
            if(event.offsetX >= this.rightEdge && event.offsetY >= this.downEdge){
                coordinateX = this.rightEdge
                coordinateY = this.downEdge
            }
            const newRectData = this.rectDraw({flag:localRectData.isFill.flag,color:localRectData.isFill.color},coordinateX,coordinateY,localRectData.width,localRectData.height,'red',false,'red',0)
            localRectData = (newRectData as rectDraw).rectData
            /* 边界处理 */
            this.stackX = [0]
            this.stackY = [0]
            this.resultX = 0
            this.resultY = 0
     
              })
    }
}
    circleDraw(isFill:any = {fill:true,color:'blue'},circleX:number,circleY:number,radius:number):object{
        const circleData = {name:'circle',id:this.id,x:circleX,y:circleY,radius}
        this.stackImage.push(circleData)
        this.circleX = circleX
        this.circleY = circleY
        this.radius = radius
        this.pen.beginPath()
        this.pen.arc(this.circleX,this.circleY,this.radius,0,2*Math.PI)
        if(isFill.fill){
            this.pen.stroke()
            this.pen.fillStyle = this.isFill.color
            this.pen.fill()
        }else{
            this.pen.stroke()
        }
        return{pen:this.pen,circleData}
    }
    circleKeyboardBind(up:string,right:string,down:string,left:string){
        for(const key in this.stackImage){
            if((this.stackImage[key] as stackImage).name === 'circle'){
                this.isCircle = true
                break;
            }
        }
        if(!this.isCircle){
            console.error(`what you have created dosen't exist circle`)
        }else{
            /* 绑定逻辑 */
            document.addEventListener('keyup',(event)=>{
                switch(event.key){
                    case up:{

                    } break;
                }
            })
        }
    }
}
