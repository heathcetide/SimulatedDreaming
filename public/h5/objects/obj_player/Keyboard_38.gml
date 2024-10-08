/// @DnDAction : YoYo Games.Instances.Set_Instance_Var
/// @DnDVersion : 1
/// @DnDHash : 6AAE91C2
/// @DnDComment : Add -move_speed to$(13_10)Y so it moves up
/// @DnDArgument : "value" "-move_speed"
/// @DnDArgument : "value_relative" "1"
/// @DnDArgument : "instvar" "1"
y += -move_speed;

/// @DnDAction : YoYo Games.Instances.Set_Sprite
/// @DnDVersion : 1
/// @DnDHash : 152907BD
/// @DnDComment : Walk up sprite
/// @DnDArgument : "imageind_relative" "1"
/// @DnDArgument : "spriteind" "spr_player_walk_up"
/// @DnDSaveInfo : "spriteind" "spr_player_walk_up"
sprite_index = spr_player_walk_up;
image_index += 0;