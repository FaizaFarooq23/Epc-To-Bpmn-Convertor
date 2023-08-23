//view diagram button
var GLOBAL_GRAPH_LIST = [];
var GLOBAL_ELEMENTS = [];
const view_diagram_btn = document.getElementById('view-diagram');

view_diagram_btn.addEventListener('click', () => {
    document.getElementById('main').style.display = 'none';
    // joint js for diagramming
    var dia = joint.dia;
    var util = joint.util;
    var standard = joint.shapes.standard;

    // Custom attribute for retrieving image placeholder with specific size
    dia.attributes.xlinkHref = {
        qualify: function (url) {
            return typeof url === 'string';
        },
        set: function (url, refBBox) {
            return { 'xlink:href': util.template(url)(refBBox.round().toJSON()) };
        }
    };

    var graph = new dia.Graph();
    new dia.Paper({
        el: document.getElementById('diagram-container'),
        width: 1800,
        height: 1000,
        gridSize: 1,
        model: graph
    });


    var rounded = joint.dia.Element.define('basic.Rounded',
        {
            attrs: {
                rect: {
                    fill: 'white',
                    rx: 10,
                    ry: 10,
                    stroke: 'black',
                    strokeWidth: 2,
                    // bind the width and height of the DOM element to the shape size
                    refWidth: '100%',
                    refHeight: '100%'
                },
                text: {
                    fontSize: 12,
                    fill: 'black',
                    yAlignment: 'middle',
                    xAlignment: 'middle',
                    refX: '50%',
                    refY: '50%',
                    ref: 'rect'
                },
            },
        },
        {
            markup: '<g class="rotatable"><rect/><text/></g>',

        });

    const visited = new Set();
    const root_node = GLOBAL_GRAPH_LIST[0];
    const root_element = findElement(GLOBAL_ELEMENTS, root_node.id);
    
    const start_circle = new joint.shapes.standard.Circle();
    start_circle.resize(80, 80);
    start_circle.position(120, 100);
    start_circle.attr('root/tabindex', 8);
    start_circle.attr('root/title', 'joint.shapes.standard.Circle');
//    start_circle.attr('label/text', 'Start');
    start_circle.addTo(graph);

    if(root_element.type === 'generic task') {
        window['rectangle_' + root_node.id] = new rounded();
        window['rectangle_' + root_node.id].resize(150, 100);
        window['rectangle_' + root_node.id].position(100, 250);
        window['rectangle_' + root_node.id].attr('text/text', root_element.value);
        window['rectangle_' + root_node.id].addTo(graph);
    } else {
        window['rectangle_' + root_node.id]= new standard.Image();
            window['rectangle_' + root_node.id].resize(150, 100);
            window['rectangle_' + root_node.id].position(100, 250);
            window['rectangle_' + root_node.id].attr('root/tabindex', 8);
            window['rectangle_' + root_node.id].attr('root/title', 'joint.shapes.standard.Image');
            
        if (root_element.type === "messageIntermediateThrowing"){
            window['rectangle_' + root_node.id].attr('image/xlinkHref', 'icons/message.drawio.svg');
            window['rectangle_' + root_node.id].attr('label/text', root_element.value);
        }
        else if (root_element.type === "parallelGateway"){
            window['rectangle_' + root_node.id].attr('image/xlinkHref', 'icons/parallel-gateway.drawio.svg');
        }
        else if (root_element.type === "inclusiveGateway"){
            window['rectangle_' + root_node.id].attr('image/xlinkHref', 'icons/inclusive-gateway.drawio.svg');
        }
        else if (root_element.type === "exclusiveGateway"){
        window['rectangle_' + root_node.id].attr('image/xlinkHref', 'icons/exclusive-gateway.drawio.svg');
        }
        window['rectangle_' + root_node.id].addTo(graph);
    }

    // advantage of joint js is that we can add a link between two elements
    const start_link = new joint.shapes.standard.Link();
    start_link.source(start_circle);
    start_link.target(window['rectangle_' + root_node.id]);
    start_link.addTo(graph);

    visited.add(root_node.id);
    console.log(GLOBAL_GRAPH_LIST);
    let parent_x = 100;
    let parent_y = 250;


    // Finding if the element is already drawn or not
    // If the element is not drawn, draw it and find its neighbor check if they are drawn and draw if they are not
    // If the element is drawn, find the neighbors and draw them if they are not drawn
    for (let i = 0; i < GLOBAL_GRAPH_LIST.length; i++) {
        if (visited.has(GLOBAL_GRAPH_LIST[i].id)) {
            let j = 1;
            for (const neighbor of GLOBAL_GRAPH_LIST[i].neighbors) {
                if (visited.has(neighbor)) {
                    continue;
                }
                const element = findElement(GLOBAL_ELEMENTS, neighbor);

                if(element.type === 'generic task') {
                window['rectangle_' + neighbor] = new rounded();
                window['rectangle_' + neighbor].resize(150, 100);

                if (j === 1) {
                    window['rectangle_' + neighbor].position(parent_x + 200, parent_y);
                    parent_x += 200;
                } else if (j === 2) {
                    window['rectangle_' + neighbor].position(parent_x - 200, parent_y + 200);
                } else if (j === 3) {
                    window['rectangle_' + neighbor].position(parent_x, parent_y - 400);
                }

                if (element.value.length > 19) {
                    element.value = element.value.replace('&nbsp;', '');
                    // find the second last space in the string and replace it with a newline
                    const last_space_index = element.value.lastIndexOf(' ', 19);
                    const first_line = element.value.substring(0, last_space_index);
                    const second_line = element.value.substring(last_space_index + 1);
                    window['rectangle_' + neighbor].attr('text/text', first_line + '\n' + second_line);
                }
                else {
                    window['rectangle_' + neighbor].attr('text/text', element.value.replace('&nbsp;', ''));
                }
                window['rectangle_' + neighbor].addTo(graph);
                } else {
                    window['rectangle_' + neighbor]= new standard.Image();
                    window['rectangle_' + neighbor].resize(150, 100);
                    if (j === 1) {
                        window['rectangle_' + neighbor].position(parent_x + 200, parent_y);
                        parent_x += 200;
                    }
                    else if (j === 2) {
                        window['rectangle_' + neighbor].position(parent_x - 200, parent_y + 200);
                    }
                    else if (j === 3) {
                        window['rectangle_' + neighbor].position(parent_x, parent_y - 400);
                    }
                    window['rectangle_' + neighbor].attr('root/tabindex', 8);
                    window['rectangle_' + neighbor].attr('root/title', 'joint.shapes.standard.Image');

                    if (element.type === "messageIntermediateThrowing"){
                        window['rectangle_' + neighbor].attr('image/xlinkHref', 'icons/message.drawio.svg');
                        window['rectangle_' + neighbor].attr('label/text', element.value);
                    }
                    else if (element.type === "parallelGateway"){
                        window['rectangle_' + neighbor].attr('image/xlinkHref', 'icons/parallel-gateway.drawio.svg');
                    }
                    else if (element.type === "inclusiveGateway"){
                        window['rectangle_' + neighbor].attr('image/xlinkHref', 'icons/inclusive-gateway.drawio.svg');
                    }
                    else if (element.type === "exclusiveGateway"){
                        window['rectangle_' + neighbor].attr('image/xlinkHref', 'icons/exclusive-gateway.drawio.svg');
                    }
                    window['rectangle_' + neighbor].addTo(graph);
                }
                visited.add(neighbor);
                j++;

                
            }
            continue;
        }
        const element = findElement(GLOBAL_ELEMENTS, GLOBAL_GRAPH_LIST[i].id);

        if(element.type === 'generic task') {
        window['rectangle_' + GLOBAL_GRAPH_LIST[i].id] = new rounded();
        window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].resize(150, 100);
        window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].position(parent_x + 200, parent_y);
        parent_x += 200;

        // If the element value is greater than 19, then we need to add a new line
        if (element.value.length > 19) {
            element.value = element.value.replace('&nbsp;', '');
            // find the second last space in the string and replace it with a newline
            const last_space_index = element.value.lastIndexOf(' ', 19);
            const first_line = element.value.substring(0, last_space_index);
            const second_line = element.value.substring(last_space_index + 1);
            window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].attr('text/text', first_line + '\n' + second_line);
        } else {
            window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].attr('text/text', element.value.replace('&nbsp;', ''));
        }
        window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].addTo(graph);
        } else {
            window['rectangle_' + GLOBAL_GRAPH_LIST[i].id]= new standard.Image();
            window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].resize(150, 100);
            window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].position(parent_x + 200, parent_y);
            parent_x += 200;
            window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].attr('root/tabindex', 8);
            window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].attr('root/title', 'joint.shapes.standard.Image');
            
            if (element.type === "messageIntermediateThrowing"){
                window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].attr('image/xlinkHref', 'icons/message.drawio.svg');
                window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].attr('label/text', element.value);
            }
            else if (element.type === "parallelGateway"){
                window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].attr('image/xlinkHref', 'icons/parallel-gateway.drawio.svg');
            }
            else if (element.type === "inclusiveGateway"){
                window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].attr('image/xlinkHref', 'icons/inclusive-gateway.drawio.svg');
            }
            else if (element.type === "exclusiveGateway"){
                window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].attr('image/xlinkHref', 'icons/exclusive-gateway.drawio.svg');
            }
            window['rectangle_' + GLOBAL_GRAPH_LIST[i].id].addTo(graph);
        }
        visited.add(GLOBAL_GRAPH_LIST[i].id);

        for (const neighbor of GLOBAL_GRAPH_LIST[i].neighbors) {
            if (visited.has(neighbor)) {
                continue;
            }
            const element = findElement(GLOBAL_ELEMENTS, neighbor);

            if(element.type === 'generic task') {
            window['rectangle_' + neighbor] = new rounded();
            window['rectangle_' + neighbor].resize(150, 100);

            if (j === 1) {
                window['rectangle_' + neighbor].position(parent_x + 200, parent_y);
                parent_x += 200;
            } else if (j === 2) {
                window['rectangle_' + neighbor].position(parent_x - 200, parent_y + 200);
            } else if (j === 3) {
                window['rectangle_' + neighbor].position(parent_x, parent_y - 400);
            }

            if (element.value.length > 19) {
                element.value = element.value.replace('&nbsp;', '');
                // find the second last space in the string and replace it with a newline
                const last_space_index = element.value.lastIndexOf(' ', 19);
                const first_line = element.value.substring(0, last_space_index);
                const second_line = element.value.substring(last_space_index + 1);
                window['rectangle_' + neighbor].attr('text/text', first_line + '\n' + second_line);
            } else {
                window['rectangle_' + neighbor].attr('text/text', element.value.replace('&nbsp;', ''));
            }
            window['rectangle_' + neighbor].addTo(graph);
            } else {
                window['rectangle_' + neighbor]= new standard.Image();
                window['rectangle_' + neighbor].resize(150, 100);
                if (j === 1) {
                    window['rectangle_' + neighbor].position(parent_x + 200, parent_y);
                    parent_x += 200;
                } else if (j === 2) {
                    window['rectangle_' + neighbor].position(parent_x - 200, parent_y + 200);
                } else if (j === 3) {
                    window['rectangle_' + neighbor].position(parent_x, parent_y - 400);
                }
                window['rectangle_' + neighbor].attr('root/tabindex', 8);
                window['rectangle_' + neighbor].attr('root/title', 'joint.shapes.standard.Image');

                if (element.type === "messageIntermediateThrowing"){
                    window['rectangle_' + neighbor].attr('image/xlinkHref', 'icons/message.drawio.svg');
                    window['rectangle_' + neighbor].attr('label/text', element.value);

                }
                else if (element.type === "parallelGateway"){
                    window['rectangle_' + neighbor].attr('image/xlinkHref', 'icons/parallel-gateway.drawio.svg');
                }
                else if (element.type === "inclusiveGateway"){
                    window['rectangle_' + neighbor].attr('image/xlinkHref', 'icons/inclusive-gateway.drawio.svg');
                }
                else if (element.type === "exclusiveGateway"){
                    window['rectangle_' + neighbor].attr('image/xlinkHref', 'icons/exclusive-gateway.drawio.svg');
                }
                window['rectangle_' + neighbor].addTo(graph);
            }
            visited.add(neighbor);
        }

    }

    const end_circle = new standard.Circle({
        attrs: {
            body: {
                'stroke-width': 6,
            }
        }
    });
    end_circle.resize(80, 80);
    end_circle.position(parent_x+20, parent_y+200);
    end_circle.attr('root/tabindex', 8);
    end_circle.attr('root/title', 'joint.shapes.standard.Circle');
//    end_circle.attr('label/text', 'End');
    end_circle.addTo(graph);


    const link_end = new standard.Link();
    if (GLOBAL_GRAPH_LIST[GLOBAL_GRAPH_LIST.length-1].neighbors.length === 0){
    link_end.source(window['rectangle_' + GLOBAL_GRAPH_LIST[GLOBAL_GRAPH_LIST.length-1].id]);
    }
    else{
        // Basically finding the last element in the neighbors array of the last element in the graph list
        link_end.source(window['rectangle_' + GLOBAL_GRAPH_LIST[GLOBAL_GRAPH_LIST.length-1].neighbors[GLOBAL_GRAPH_LIST[GLOBAL_GRAPH_LIST.length-1].neighbors.length-1]]);
    }
    link_end.target(end_circle);
    link_end.addTo(graph);





    // This is for adding links between the elements
    for(const ele of GLOBAL_GRAPH_LIST){
        for (const neighbor of ele.neighbors){
            var link = new joint.shapes.standard.Link();
            link.source(window['rectangle_' + ele.id]);
            link.target(window['rectangle_' + neighbor]);
            link.addTo(graph);
        }
    }



    // var image = new standard.Image();
    // image.resize(150, 100);
    // image.position(250, 50);
    // image.attr('root/tabindex', 8);
    // image.attr('root/title', 'joint.shapes.standard.Image');
    // image.attr('label/text', 'Image');
    // image.attr('image/xlinkHref', 'https://static-00.iconduck.com/assets.00/intermediate-event-throw-message-icon-2048x2045-67ayof3q.png');
    // image.addTo(graph);

    // var link = new standard.Link();
    // link.source(rectangle);
    // link.target(image);
    // link.addTo(graph);

});

const uploadFile = async (file) => {
    const url = 'http://127.0.0.1:8000/upload-file/';
    const formData = new FormData();

    formData.append('file', file, {
        filename: file.filename,
        contentType: 'text/xml'
    });

    try {
        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            }
        });

        // Handle response
        console.log('Response:', response);


        createDiagram(response.data);

    } catch (error) {
        // Handle error
        console.error('Error uploading file:', error.message);
    }
};



// Example usage:
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    uploadFile(file);
});


const createDiagram = async (elements) => {

    // diagram_div.style.display = 'flex';
    //   document.getElementById('main').style.display = 'none';
    const graph_dsa = new Graph();

    for (const element of elements) {
        if (element.type === "Arrow") {
            graph_dsa.addVertex(element);
        } else {
            if (element.type === "StartEvent" || element.type === "EndEvent") {
                continue;
            }
            graph_dsa.addNode(element);
        }
        // Now you can use the graph to perform graph-related operations
    }
    for (const element of elements) {
        if (element.type === "Arrow") {
            graph_dsa.addEdge(element.source, element.target);
        }
    }

    const graphList = []

    // Node id:A:
    //       neighbor: [B, C, D]

    for (const [node, neighbors] of graph_dsa.adjacencyList) {
        if (neighbors.length === 0) {
            continue;
        }
        graphList.push({
            id: node,
            neighbors: neighbors
        });
    }
    GLOBAL_ELEMENTS = elements;
    GLOBAL_GRAPH_LIST = graphList;

};



const createStartEvent = () => {
    const startEvent = document.createElement('div');
    startEvent.classList.add('start-event');
    return startEvent;
}

const createEndEvent = () => {
    const endEvent = document.createElement('div');
    endEvent.classList.add('end-event');
    return endEvent;
}

const createArrow = (direction) => {
    const arrow = document.createElement('img');
    arrow.src = './icons/arrow.svg';
    arrow.width = 50;
    arrow.height = 40;
    arrow.style.transform = `rotate(${direction}deg)`;
    return arrow;
}


const findElement = (elements, id) => {
    console.log(id)
    for (const element of elements) {
        // console.log(element['id']);
        if (element['id'] === id) {
            return element;
        }
    }
    return null;
}

const createTask = (taskName) => {
    const task = document.createElement('div');
    task.classList.add('generic-task');
    task.innerHTML = taskName;
    return task;
}

class Graph {
    constructor() {
        this.adjacencyList = new Map();
    }

    addNode(node) {
        this.adjacencyList.set(node.id, []);
    }

    addVertex(vertex) {
        this.adjacencyList.set(vertex.id, []);
    }

    addEdge(sourceId, targetId) {
        const sourceNeighbors = this.adjacencyList.get(sourceId);
        const targetNeighbors = this.adjacencyList.get(targetId);

        if (!sourceNeighbors || !targetNeighbors) {
            throw new Error("Invalid source or target node id");
        }

        sourceNeighbors.push(targetId);

        // If the graph is undirected, add the reverse edge as well
        // For a directed graph, skip this step
        // targetNeighbors.push(sourceId);
    }

    getNodes() {
        return Array.from(this.adjacencyList.values());
    }

    getVertices() {
        return Array.from(this.adjacencyList.values());
    }

    getNeighbors(nodeId) {
        const neighbors = this.adjacencyList.get(nodeId);
        return neighbors ? neighbors : [];
    }
}
