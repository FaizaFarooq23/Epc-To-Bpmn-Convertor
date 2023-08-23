from drawio import DrawIoXMLReader


class EpcToBpmnMapper:
    epc_notation = ["Event", "Function", "AND", "OR", "XOR"]
    bpmn_notation = ["messageIntermediateThrowing", "generic task", "parallelGateway", "inclusiveGateway", "exclusiveGateway"]
    

    def mapper(self, shapes):
        bpmn_shapes = []
        bpmn_start_shape = {
            "id": "Start",
            "value": "Start",
            "type": "StartEvent",
            "width": "30",
            "height": "30"
        }
            
        bpmn_shapes.append(bpmn_start_shape)
        for shape in shapes:
            bpmn_shape = {}
            if "source" in shape:
                bpmn_shape["id"] = shape["id"]
                bpmn_shape["source"] = shape["source"]
                bpmn_shape["target"] = shape["target"]
                bpmn_shape["type"] = "Arrow"
            else:
                bpmn_shape["id"] = shape["id"]
                bpmn_shape["value"] = shape["value"]
                bpmn_shape["type"] = self.bpmn_notation[self.epc_notation.index(shape["type"])]
                bpmn_shape["width"] = shape["width"]
                bpmn_shape["height"] = shape["height"]
            bpmn_shapes.append(bpmn_shape)
        bpmn_end_shape = {
            "id": "End",
            "value": "End",
            "type": "EndEvent",
            "width": "30",
            "height": "30"
        }
        bpmn_shapes.append(bpmn_end_shape)
        return bpmn_shapes