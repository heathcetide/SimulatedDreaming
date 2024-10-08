/// @DnDAction : YoYo Games.Particles.Part_Syst_Create
/// @DnDVersion : 1.1
/// @DnDHash : 7FDC4D5F
/// @DnDComment : Create a new particle system for this instance's effects
/// @DnDArgument : "var" "part_sys"
part_sys = part_system_create_layer("Instances", 0);

/// @DnDAction : YoYo Games.Particles.Part_Type_Create
/// @DnDVersion : 1.1
/// @DnDHash : 3A1EFD5F
/// @DnDComment : Create a particle type for the gate's light
/// @DnDArgument : "var" "light"
/// @DnDArgument : "blend" "1"
light = part_type_create();
part_type_blend(light, true);

/// @DnDAction : YoYo Games.Particles.Part_Type_Life
/// @DnDVersion : 1
/// @DnDHash : 44D9C1FD
/// @DnDComment : Set the life of the light particle
/// @DnDArgument : "typ" "light"
/// @DnDArgument : "minlife" "80"
/// @DnDArgument : "maxlife" "160"
part_type_life(light, 80, 160);

/// @DnDAction : YoYo Games.Particles.Part_Type_Sprite
/// @DnDVersion : 1
/// @DnDHash : 4A88F7B4
/// @DnDComment : Set the sprite of the light particle
/// @DnDArgument : "type" "light"
/// @DnDArgument : "sprite" "spr_entrance_particle"
/// @DnDSaveInfo : "sprite" "spr_entrance_particle"
part_type_sprite(light, spr_entrance_particle, true, false, false);

/// @DnDAction : YoYo Games.Particles.Part_Type_Size
/// @DnDVersion : 1
/// @DnDHash : 30C99D9E
/// @DnDComment : Set the size of the light particle
/// @DnDArgument : "type" "light"
/// @DnDArgument : "minsize" "0.3"
/// @DnDArgument : "maxsize" "0.48"
/// @DnDArgument : "sizeincr" "-0.002"
part_type_size(light, 0.3, 0.48, -0.002, 0);

/// @DnDAction : YoYo Games.Particles.Part_Type_Alpha
/// @DnDVersion : 1
/// @DnDHash : 74C12326
/// @DnDComment : Set the alpha of the light particle
/// @DnDArgument : "type" "light"
/// @DnDArgument : "start" "0.1"
/// @DnDArgument : "end" "0"
part_type_alpha3(light, 0.1, 1, 0);

/// @DnDAction : YoYo Games.Particles.Part_Type_Speed
/// @DnDVersion : 1
/// @DnDHash : 074E2EB0
/// @DnDComment : Set the speed of the light particle
/// @DnDArgument : "type" "light"
/// @DnDArgument : "minspeed" "0.2"
/// @DnDArgument : "maxspeed" "0.8"
part_type_speed(light, 0.2, 0.8, 0, 0);

/// @DnDAction : YoYo Games.Particles.Part_Type_Direction
/// @DnDVersion : 1
/// @DnDHash : 3DD16200
/// @DnDComment : Set the movement direction of the light particle,$(13_10)which is based on the 'light_direction' variable$(13_10)defined in the Variable Definitions of this object$(13_10)$(13_10)The 'light_direction_increase' variable from the$(13_10)Variable Definitions is also used
/// @DnDArgument : "type" "light"
/// @DnDArgument : "mindir" "light_direction - 30"
/// @DnDArgument : "maxdir" "light_direction + 30"
/// @DnDArgument : "incr" "light_direction_increase"
/// @DnDArgument : "wiggle" "0.5"
part_type_direction(light, light_direction - 30, light_direction + 30, light_direction_increase, 0.5);

/// @DnDAction : YoYo Games.Particles.Part_Emit_Create
/// @DnDVersion : 1
/// @DnDHash : 0CACD311
/// @DnDComment : Create an emitter to continually emit particles$(13_10)in our system
/// @DnDArgument : "var" "light_emitter"
/// @DnDArgument : "system" "part_sys"
light_emitter = part_emitter_create(part_sys);

/// @DnDAction : YoYo Games.Particles.Part_Emit_Region
/// @DnDVersion : 1
/// @DnDHash : 67CADDB2
/// @DnDComment : Set the region where this emitter will create particles$(13_10)$(13_10)The region is based on the bounding box of this instance$(13_10)(its actual dimensions in the room)
/// @DnDArgument : "left" "bbox_left"
/// @DnDArgument : "top" "bbox_top"
/// @DnDArgument : "right" "bbox_right"
/// @DnDArgument : "bottom" "bbox_bottom"
/// @DnDArgument : "system" "part_sys"
/// @DnDArgument : "emitter" "light_emitter"
/// @DnDArgument : "distribution" "1"
part_emitter_region(part_sys, light_emitter, bbox_left, bbox_right, bbox_top, bbox_bottom, ps_shape_rectangle, ps_distr_gaussian);

/// @DnDAction : YoYo Games.Particles.Part_Emit_Emit
/// @DnDVersion : 1
/// @DnDHash : 4FB5C7A5
/// @DnDComment : Tell the emitter to continually "stream" the light particle type$(13_10)$(13_10)The count is taken from the 'light_count' variable defined in the$(13_10)Variable Definitions
/// @DnDArgument : "system" "part_sys"
/// @DnDArgument : "emitter" "light_emitter"
/// @DnDArgument : "type" "light"
/// @DnDArgument : "event" "1"
/// @DnDArgument : "number" "light_count"
part_emitter_stream(part_sys, light_emitter, light, light_count);