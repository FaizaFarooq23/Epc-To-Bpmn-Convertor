import xml.etree.ElementTree as ET
import os


class DrawIoXMLReader:
    def __init__(self, file):
        ''' This is the constructor method for the DrawIoXMLReader class.'''
        self.file = file
        self.tree = ET.parse(self.file)
        self.root = self.tree.getroot()
        self.shapes = []

    def writeToFile(self, filename):
        with open(filename, "w") as file:
            for shape in self.shapes:
                for key, value in shape.items():
                    file.write("Shape {} : {}\n".format(key, value))
                file.write("---\n")

    def getShapes(self):
        ''' This method returns a list of all the shapes in the XML file.'''
        for shape in self.root.findall(".//mxCell"):

            shape_style = shape.get("style", "")
            shape_value = shape.get("value", "")
            shape_edge = shape.get("edge", "")
            if shape_edge == "1":
                self.shapes.append(
                    {
                        "id": shape.get("id", ""),
                        "source": shape.get("source", ""),
                        "target": shape.get("target", ""),
                    }
                )
                continue
            if shape_style.startswith("shape=hexagon"):
                shape_child = shape.find(".//mxGeometry")
                width = shape_child.get("width", "")
                height = shape_child.get("height", "")
                self.shapes.append(
                    {
                        "id": shape.get("id", ""),
                        "value": shape_value,
                        "type": "Event",
                        "width": width,
                        "height": height
                    }
                )
            elif shape_style.startswith("ellipse"):
                shape_child = shape.find(".//mxGeometry")
                width = shape_child.get("width", "")
                height = shape_child.get("height", "")
                self.shapes.append(
                    {
                        "id": shape.get("id", ""),
                        "value": shape_value,
                        "type": shape_value,
                        "width": width,
                        "height": height
                    }
                )
            elif shape_style.startswith("rounded=1"):
                shape_child = shape.find(".//mxGeometry")
                width = shape_child.get("width", "")
                height = shape_child.get("height", "")
                self.shapes.append(
                    {
                        "id": shape.get("id", ""),
                        "value": shape_value,
                        "type": "Function",
                        "width": width,
                        "height": height
                    }
                )

        return self.shapes
