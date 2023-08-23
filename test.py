from drawio import DrawIoXMLReader
from mapper import EpcToBpmnMapper
import xml.etree.ElementTree as ET

drawIoXmlReader = DrawIoXMLReader('./EPC.drawio.xml')

shape = drawIoXmlReader.getShapes()

bpmn_representation = EpcToBpmnMapper().mapper(shape)

print(bpmn_representation)

import xml.etree.ElementTree as ET

def create_element(tag, **kwargs):
    element = ET.Element(tag, **kwargs)
    return element

def create_drawio_xml(diagram):
    root = create_element('mxfile', version='13.0.7')
    diagram_root = create_element('diagram')
    root.append(diagram_root)

    for item in diagram:
        element_type = item['type']
        element_value = item['value']
        element_width = item['width']
        element_height = item['height']

        if element_type == 'StartEvent':
            shape = create_element('mxCell', style='shape=mxgraph.bpmn.event;symbol=start;outlineConnect=0;', vertex='1', parent='1')
            diagram_root.append(shape)

        elif element_type == 'messageIntermediateThrowing':
            shape = create_element('mxCell', style='shape=mxgraph.bpmn.event;symbol=message;outlineConnect=0;', vertex='1', parent='1')
            diagram_root.append(shape)

        elif element_type == 'generic task':
            shape = create_element('mxCell', style='shape=mxgraph.bpmn.task;outlineConnect=0;', vertex='1', parent='1')
            diagram_root.append(shape)

        elif element_type == 'exclusiveGateway':
            shape = create_element('mxCell', style='shape=mxgraph.bpmn.gateway;xor;outlineConnect=0;', vertex='1', parent='1')
            diagram_root.append(shape)

        elif element_type == 'EndEvent':
            shape = create_element('mxCell', style='shape=mxgraph.bpmn.event;symbol=end;outlineConnect=0;', vertex='1', parent='1')
            diagram_root.append(shape)

        shape_geometry = create_element('mxGeometry', width=element_width, height=element_height)
        shape.append(shape_geometry)
        shape_label = create_element('mxCell', style='text;html=1;strokeColor=none;fillColor=none;whiteSpace=wrap;rounded=0;')
        shape_label.attrib['vertex'] = '1'
        shape_label.attrib['connectable'] = '0'
        shape_label_geometry = create_element('mxGeometry', relative='1', y='0.5', width='0', height='17', as_='geometry', dy='25')
        shape_label.append(shape_label_geometry)
        shape_label_value = create_element('mxCellValue')
        shape_label_value.text = element_value
        shape_label.append(shape_label_value)
        diagram_root.append(shape_label)

    tree = ET.ElementTree(root)
    return tree


diagram_xml = create_drawio_xml(bpmn_representation)
xml_string = ET.tostring(diagram_xml.getroot()).decode()

with open('bpmn.drawio.xml', 'w') as f:
    f.write(xml_string)

