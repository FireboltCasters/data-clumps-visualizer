export class ExampleTestData{
    static getDataClumpsDict(){
        return (
            {
                "version": "0.0.1",
                "data_clumps": {
                    "Fields1.java-Fields1-Fields2-xys": {
                        "type": "data_clump",
                        "key": "Fields1.java-Fields1-Fields2-xys",
                        "file_path": "Fields1.java",
                        "class_or_interface_name": "Fields1",
                        "class_or_interface_key": "Fields1",
                        "method_name": null,
                        "method_key": null,
                        "data_clump_type": "field_data_clump",
                        "data_clump_data": {
                            "Fields1/memberParameter/x": {
                                "key": "Fields1/memberParameter/x",
                                "name": "x",
                                "type": "int",
                                "modifiers": [],
                                "related_to_context": {
                                    "key": "Fields2.java-Fields2-x",
                                    "file_path": "Fields2.java",
                                    "class_or_interface_name": "Fields2",
                                    "class_or_interface_key": "Fields2",
                                    "parameter": {
                                        "key": "Fields2/memberParameter/x",
                                        "name": "x",
                                        "type": "int",
                                        "modifiers": []
                                    }
                                }
                            },
                            "Fields1/memberParameter/y": {
                                "key": "Fields1/memberParameter/y",
                                "name": "y",
                                "type": "int",
                                "modifiers": [],
                                "related_to_context": {
                                    "key": "Fields2.java-Fields2-xy",
                                    "file_path": "Fields2.java",
                                    "class_or_interface_name": "Fields2",
                                    "class_or_interface_key": "Fields2",
                                    "parameter": {
                                        "key": "Fields2/memberParameter/y",
                                        "name": "y",
                                        "type": "int",
                                        "modifiers": []
                                    }
                                }
                            },
                            "Fields1/memberParameter/s": {
                                "key": "Fields1/memberParameter/s",
                                "name": "s",
                                "type": "String",
                                "modifiers": [],
                                "related_to_context": {
                                    "key": "Fields2.java-Fields2-xys",
                                    "file_path": "Fields2.java",
                                    "class_or_interface_name": "Fields2",
                                    "class_or_interface_key": "Fields2",
                                    "parameter": {
                                        "key": "Fields2/memberParameter/s",
                                        "name": "s",
                                        "type": "String",
                                        "modifiers": []
                                    }
                                }
                            }
                        }
                    },
                    "Fields2.java-Fields2-Fields1-xys": {
                        "type": "data_clump",
                        "key": "Fields2.java-Fields2-Fields1-xys",
                        "file_path": "Fields2.java",
                        "class_or_interface_name": "Fields2",
                        "class_or_interface_key": "Fields2",
                        "method_name": null,
                        "method_key": null,
                        "data_clump_type": "field_data_clump",
                        "data_clump_data": {
                            "Fields2/memberParameter/x": {
                                "key": "Fields2/memberParameter/x",
                                "name": "x",
                                "type": "int",
                                "modifiers": [],
                                "related_to_context": {
                                    "key": "Fields1.java-Fields1-x",
                                    "file_path": "Fields1.java",
                                    "class_or_interface_name": "Fields1",
                                    "class_or_interface_key": "Fields1",
                                    "parameter": {
                                        "key": "Fields1/memberParameter/x",
                                        "name": "x",
                                        "type": "int",
                                        "modifiers": []
                                    }
                                }
                            },
                            "Fields2/memberParameter/y": {
                                "key": "Fields2/memberParameter/y",
                                "name": "y",
                                "type": "int",
                                "modifiers": [],
                                "related_to_context": {
                                    "key": "Fields1.java-Fields1-xy",
                                    "file_path": "Fields1.java",
                                    "class_or_interface_name": "Fields1",
                                    "class_or_interface_key": "Fields1",
                                    "parameter": {
                                        "key": "Fields1/memberParameter/y",
                                        "name": "y",
                                        "type": "int",
                                        "modifiers": []
                                    }
                                }
                            },
                            "Fields2/memberParameter/s": {
                                "key": "Fields2/memberParameter/s",
                                "name": "s",
                                "type": "String",
                                "modifiers": [],
                                "related_to_context": {
                                    "key": "Fields1.java-Fields1-xys",
                                    "file_path": "Fields1.java",
                                    "class_or_interface_name": "Fields1",
                                    "class_or_interface_key": "Fields1",
                                    "parameter": {
                                        "key": "Fields1/memberParameter/s",
                                        "name": "s",
                                        "type": "String",
                                        "modifiers": []
                                    }
                                }
                            }
                        }
                    }
                }
            }

        )
    }
}
