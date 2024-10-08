/// @DnDAction : YoYo Games.Instances.Set_Instance_Var
/// @DnDVersion : 1
/// @DnDHash : 230D7DC7
/// @DnDComment : Add -move_speed to$(13_10)X so it moves left
/// @DnDArgument : "value" "-move_speed"
/// @DnDArgument : "value_relative" "1"
x += -move_speed;

/// @DnDAction : YoYo Games.Instances.Set_Sprite
/// @DnDVersion : 1
/// @DnDHash : 4F6CFB8E
/// @DnDComment : Walk to side sprite
/// @DnDArgument : "imageind_relative" "1"
/// @DnDArgument : "spriteind" "spr_player_walk_side"
/// @DnDSaveInfo : "spriteind" "spr_player_walk_side"
sprite_index = spr_player_walk_side;
image_index += 0;

/// @DnDAction : YoYo Games.Instances.Sprite_Scale
/// @DnDVersion : 1
/// @DnDHash : 1917B558
/// @DnDComment : Since it's using the same$(13_10)"side" sprite, we need to$(13_10)flip the instance by setting$(13_10)its horizontal scale to -1,$(13_10)so it faces left$(13_10)$(13_10)This also carries over to$(13_10)the idle state and keeps$(13_10)it facing in the direction$(13_10)it was moving in
/// @DnDArgument : "xscale" "-1"
image_xscale = -1;
image_yscale = 1;