(function () {
    //var $ = $fd_jQuery || $;
  
    var api_object_name = "fd_api";
    var global = Function('return this')();
    
    global.FDApiClient = function () {
        var me = this;
        var _host_plugin_name = 'FDWebItemHost';
        var init = function () {

        };

      this.assertNotNull = function (parameter_value, parameter_name) {
            if (parameter_value === null || parameter_value === undefined) {
                throw "Parameter \"" + parameter_name + "\" is required.";
            }
        };

        var execute = function (command_name, command_arguments) {
            var deferred = $.Deferred();
            var page_number = parseInt(command_arguments['page_number'] || 0);
            var page_size = parseInt(command_arguments['page_size'] || 10);

            switch (command_name) {
                case 'eventGetSessionsByName':
                    var session_name = command_arguments['session_name'] || null;
                    var room_name = command_arguments['room_name'] || null;
                    me.assertNotNull(session_name,"session name");

                    if (!room_name) {
                        method_result = [{
                            "session_1": {
                                name: "session_1",
                                label: "Session One",
                                description: "Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices.",
                                start_date: "2013-10-02T06:00:00Z",
                                end_date: "2013-10-04T08:00:00Z",
                                track: "master",
                                rooms: [{
                                    name: "imperial_ballroom",
                                    label: "Imperial Ballroom",
                                    venue: "venue_1",
                                    maptiles: "venue_1",
                                    level: "0",
                                    xpos: "-0.25769",
                                    ypos: "0.44703",
                                    beacons: ["3ea37847-2897-11e4-8069-f23c916e3c24", "c3e41af2-2897-11e4-8069-f23c916e3c24"],
                                    speakers: ["user_10", "user_11", "user_12", "user_13", "user_14", "user_15", "user_16", "user_17", "user_18", "user_19", "user_20"],
                                    //speakers: [],
                                    moderators: ["user_72", "user_74"]
                                },
                                {
                                    name: "regal_ballroom",
                                    label: "Regal Room",
                                    venue: "venue_1",
                                    maptiles: "venue_1",
                                    level: "0",
                                    xpos: "-0.5006",
                                    ypos: "0.56248",
                                    beacons: ["3ea37847-2897-11e4-8069-f23c916e3c24", "c3e41af2-2897-11e4-8069-f23c916e3c24"],
                                    speakers: ["user_1", "user_2", "user_3", "user_4", "user_5", "user_6", "user_7", "user_9", "user_8"],
                                    //speakers: [],
                                    moderators: ["user_62", "user_64"]
                                }]
                            }
                        }];
                    }
                    else {
                        method_result = [{
                            "session_1": {
                                name: "session_1",
                                label: "Session 1 Label",
                                description: "Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices.",
                                start_date: "2013-10-02T06:00:00Z",
                                end_date: "2013-10-02T08:00:00Z",
                                track: "master",
                                rooms: [{
                                    name: "imperial_ballroom",
                                    label: "Imperial Ballroom",
                                    venue: "venue_1",
                                    maptiles: "venue_1",
                                    level: "0",
                                    xpos: "-0.25769",
                                    ypos: "0.44703",
                                    beacons: ["3ea37847-2897-11e4-8069-f23c916e3c24", "c3e41af2-2897-11e4-8069-f23c916e3c24"],
                                    speakers: ["user_10", "user_11", "user_12", "user_13", "user_14", "user_15"],
                                    moderators: ["user_72", "user_74"]
                                }]
                            }

                        }];
                    }
                    break;

                case 'eventGetSessionsByTrack':
                    var track_name = command_arguments['track_name'] || null;
                    var date_range = command_arguments['date_range'] || null;
                    var date_time = command_arguments['date_time'] || null;
                    var room_name = command_arguments['room_name'] || null;

                    me.assertNotNull(track_name,"track name");
                    method_result = {
                };
                break;
                    
                case 'eventGetSessionsByUser':
                    var user_name = command_arguments['user_name'] || null;
                    var date_range = command_arguments['date_range'] || null;
                    var date_time = command_arguments['date_time'] || null;

                    me.assertNotNull(user_name, "user name");
                    method_result = {
                };
                break;

                case 'eventGetSessionsByBeacon':
                    var beacon_uuid = command_arguments['beacon_uuid'] || null;
                    var date_time = command_arguments['date_time'] || null;

                    me.assertNotNull(beacon_uuid, "beacon uuid");
                    method_result = {
                };
                break;

                case 'eventGetSessionsByProximity':
                    var date_time = command_arguments['date_time'] || null;
                    method_result = [{
                }];
                break;

                case 'eventGetUsers':
                    var session_name = command_arguments['session_name'] || null;
                    var room_name = command_arguments['room_name'] || null;
                    var role = command_arguments['role'] || null;

                    method_result = [{
                }];
                break;

                case 'eventGetUsersByBeacon':
                    var beacon_uuid = command_arguments['beacon_uuid'] || null;
                    method_result = {
                };
                break;

                case 'eventGetUsersByProximity':
                    method_result = {
                        "user_1": {
                            "name": "user_1",
                            "first": "Sharon",
                            "last": "McCarthy",
                            "role": "Representative",
                            "device": "10002011"
                        },
                        "user_2": {
                            "name": "user_2",
                            "first": "Tanusree",
                            "last": "Misra",
                            "role": "District Manager",
                            "device": "10005394"
                        },
                        "user_3": {
                            "name": "user_3",
                            "first": "Kimberly",
                            "last": "Troxell",
                            "role": "Region Manager",
                            "device": "10009488"
                        },
                        "user_4": {
                            "name": "user_4",
                            "first": "James",
                            "last": "Notorfrancesco",
                            "role": "Representative",
                            "device": "10010009"
                        },
                        "user_5": {
                            "name": "user_5",
                            "first": "Heather",
                            "last": "Miller",
                            "role": "Representative",
                            "device": "10011784"
                        },
                        "user_6": {
                            "name": "user_6",
                            "first": "William",
                            "last": "Yen",
                            "role": "Account Executive",
                            "device": "10012591"
                        },
                        "user_7": {
                            "name": "user_7",
                            "first": "Teresa",
                            "last": "Woody",
                            "role": "Representative",
                            "device": "10013378"
                        },
                        "user_8": {
                            "name": "user_8",
                            "first": "Brian",
                            "last": "Haapala",
                            "role": "Representative",
                            "device": "10015697"
                        },
                        "user_9": {
                            "name": "user_9",
                            "first": "David",
                            "last": "Leary",
                            "role": "Representative",
                            "device": "10015965"
                        }
                    };
                    break;

                    case 'userGetProfile':
                        var user_name = command_arguments['user_name'] || null;
                        var device_uuid = command_arguments['device_uuid'] || null;

                        me.assertNotNull("user name",user_name);

                        if (user_name == 'user_1') {
                            method_result = {
                                "user_1": {
                                    "name": "user_1",
                                    "first": "Sharon",
                                    "last": "McCarthy",
                                    "role": "Representative",
                                    "device": "10002011",
                                    "description": {
                                        "email": "sharon.mccarthy@example.com",
                                        "group_name": "Rheum",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_2') {
                            method_result = {
                                "user_2": {
                                    "name": "user_2",
                                    "first": "Tanusree",
                                    "last": "Misra",
                                    "role": "District Manager",
                                    "device": "10005394",
                                    "description": {
                                        "email": "tanusree.misra@example.com",
                                        "group_name": "Gastro",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_3') {
                            method_result = {
                                "user_3": {
                                    "name": "user_3",
                                    "first": "Kimberly",
                                    "last": "Troxell",
                                    "role": "Region Manager",
                                    "device": "10009488",
                                    "description": {
                                        "email": "kimberly.troxell@example.com",
                                        "group_name": "Gastro",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_4') {
                            method_result = {
                                "user_4": {
                                    "name": "user_4",
                                    "first": "James",
                                    "last": "Notorfrancesco",
                                    "role": "Representative",
                                    "device": "10010009",
                                    "description": {
                                        "email": "james.notorfrancesco@example.com",
                                        "group_name": "Rheum",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_5') {
                            method_result = {
                                "user_5": {
                                    "name": "user_5",
                                    "first": "Heather",
                                    "last": "Miller",
                                    "role": "Representative",
                                    "device": "10011784",
                                    "description": {
                                        "email": "heather.miller@example.com",
                                        "group_name": "Rheum",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_6') {
                            method_result = {
                                "user_6": {
                                    "name": "user_6",
                                    "first": "William",
                                    "last": "Yen",
                                    "role": "Account Executive",
                                    "device": "10012591",
                                    "description": {
                                        "email": "william.yen@example.com",
                                        "group_name": "IAE",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_7') {
                            method_result = {
                                "user_7": {
                                    "name": "user_7",
                                    "first": "Teresa",
                                    "last": "Woody",
                                    "role": "Representative",
                                    "device": "10013378",
                                    "description": {
                                        "email": "teresa.woody@example.com",
                                        "group_name": "Rheum",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_8') {
                            method_result = {
                                "user_8": {
                                    "name": "user_8",
                                    "first": "Brian",
                                    "last": "Haapala",
                                    "role": "Representative",
                                    "device": "10015697",
                                    "description": {
                                        "email": "brian.haapala@example.com",
                                        "group_name": "Rheum",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_9') {
                            method_result = {
                                "user_9": {
                                    "name": "user_9",
                                    "first": "David",
                                    "last": "Leary",
                                    "role": "Representative",
                                    "device": "10015965",
                                    "description": {
                                        "email": "david.leary@example.com",
                                        "group_name": "Gastro",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_10') {
                            method_result = {
                                "user_10": {
                                    "name": "user_10",
                                    "first": "Jennifer",
                                    "last": "Trenn",
                                    "role": "District Manager",
                                    "device": "10018458",
                                    "description": {
                                        "email": "jennifer.trenn@example.com",
                                        "group_name": "Rheum",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_11') {
                            method_result = {
                                "user_11": {
                                    "name": "user_11",
                                    "first": "Robert",
                                    "last": "Vinson",
                                    "role": "District Manager",
                                    "device": "10020104",
                                    "description": {
                                        "email": "r.brice.vinson@example.com",
                                        "group_name": "Rheum",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_12') {
                            method_result = {
                                "user_12": {
                                    "name": "user_12",
                                    "first": "Javier",
                                    "last": "Maldonado",
                                    "role": "Representative",
                                    "device": "10020213",
                                    "description": {
                                        "email": "javier.maldonado@example.com",
                                        "group_name": "Rheum",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_13') {
                            method_result = {
                                "user_13": {
                                    "name": "user_13",
                                    "first": "Brian",
                                    "last": "Bautista",
                                    "role": "Region Manager",
                                    "device": "10023575",
                                    "description": {
                                        "email": "brian.bautista@example.com",
                                        "group_name": "IAE",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_14') {
                            method_result = {
                                "user_14": {
                                    "name": "user_14",
                                    "first": "Stephanie",
                                    "last": "Hine",
                                    "role": "Representative",
                                    "device": "10027988",
                                    "description": {
                                        "email": "stephanie.hine@example.com",
                                        "group_name": "Rheum",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            }
                        }
                        else if (user_name == 'user_15') {
                            method_result = {
                                "user_15": {
                                    "name": "user_15",
                                    "first": "Tanya",
                                    "last": "Wilhite",
                                    "role": "Representative",
                                    "device": "10035699",
                                    "description": {
                                        "email": "tanya.wilhite@example.com",
                                        "group_name": "Derm",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_16') {
                            method_result = {
                                "user_16": {
                                    "name": "user_16",
                                    "first": "Leah",
                                    "last": "O'Connor",
                                    "role": "Account Executive",
                                    "device": "10035866",
                                    "description": {
                                        "email": "leah.o'connor@example.com",
                                        "group_name": "IAE",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_17') {
                            method_result = {
                                "user_17": {
                                    "name": "user_17",
                                    "first": "Kimberly",
                                    "last": "Kubik",
                                    "role": "Region Manager",
                                    "device": "10036043",
                                    "description": {
                                        "email": "kim.kubik@example.com",
                                        "group_name": "Rheum",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_18') {
                            method_result = {
                                "user_18": {
                                    "name": "user_18",
                                    "first": "Charles",
                                    "last": "Miller",
                                    "role": "District Manager",
                                    "device": "10039457",
                                    "description": {
                                        "email": "charles.miller@example.com",
                                        "group_name": "Gastro",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_19') {
                            method_result = {
                                "user_19": {
                                    "name": "user_19",
                                    "first": "Michael",
                                    "last": "Harteis",
                                    "role": "Representative",
                                    "device": "10041092",
                                    "description": {
                                        "email": "michael.harteis@example.com",
                                        "group_name": "Gastro",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            };
                        }
                        else if (user_name == 'user_20') {
                            method_result = {
                                "user_20": {
                                    "name": "user_20",
                                    "first": "Mark",
                                    "last": "Hankins",
                                    "role": "Representative",
                                    "device": "10041198",
                                    "description": {
                                        "email": "markdhankins@example.com",
                                        "group_name": "Rheum",
                                        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus egestas consequat. Curabitur consectetur urna tempor dui vehicula sagittis. Quisque porttitor pellentesque lorem, vel ornare erat auctor in. Proin fringilla lacus pretium enim egestas, vel commodo sem tristique. Pellentesque cursus pulvinar elementum. Suspendisse viverra mauris tristique turpis pellentesque pharetra."
                                    }
                                }
                            }
                        }
                        break;

                        case 'userGetDevices':
                            var room_name = command_arguments['room_name'] || null;
                            var beacon_uuid = command_arguments['beacon_uuid'] || null;
                            me.assertNotNull(room_name, "room name");
                            me.assertNotNull(beacon_uuid, "beacon uuid");

                            method_result = {
                        };
                        break;

                        default:

                            deferred.reject.apply(this, ['method not found']);
                        };

               /* deferred.resolve.apply(this, {
                    records: method_result,
                    page_number: page_number,
                    page_size: page_size
                });

                return deferred;*/
            
            return method_result;
                };

            me.eventGetSessionsByName = function (command_arguments) {
                return execute('eventGetSessionsByName', command_arguments);
            };

            me.eventGetSessionsByTrack = function (command_arguments) {
                return execute('eventGetSessionsByTrack', command_arguments);
            };

            me.eventGetSessionsByUser = function (command_arguments) {
                return execute('eventGetSessionsByUser', command_arguments);
            };

            me.eventGetSessionsByProximity = function (command_arguments) {
                return execute('eventGetSessionsByProximity', command_arguments);
            };

            me.eventGetSessionsByBeacon = function (command_arguments) {
                return execute('eventGetSessionsByBeacon', command_arguments);
            };

            me.eventGetUsers = function (command_arguments) {
                return execute('eventGetUsers', command_arguments);
            };

            me.eventGetUsersByProximity = function () {
                return execute('eventGetUsersByProximity', {});
            };

            me.eventGetUsersByBeacon = function (command_arguments) {
                return execute('eventGetUsersByProximity', command_arguments);
            };

            me.userGetProfile = function (command_arguments) {
                return execute('userGetProfile', command_arguments);
            };

            me.userGetDevices = function (command_arguments) {
                return execute('userGetDevices', command_arguments);
            };

            init();
    };

    global[api_object_name] = new FDApiClient();

})();