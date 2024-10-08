/// @DnDAction : YoYo Games.Instances.Set_Instance_Var
/// @DnDVersion : 1
/// @DnDHash : 7498BB94
/// @DnDComment : Add move_speed to$(13_10)Y so it moves down
/// @DnDArgument : "value" "move_speed"
/// @DnDArgument : "value_relative" "1"
/// @DnDArgument : "instvar" "1"
y += move_speed;

/// @DnDAction : YoYo Games.Instances.Set_Sprite
/// @DnDVersion : 1
/// @DnDHash : 6E40BDD7
/// @DnDComment : Walk down sprite
/// @DnDArgument : "imageind_relative" "1"
/// @DnDArgument : "spriteind" "spr_player_walk_down"
/// @DnDSaveInfo : "spriteind" "spr_player_walk_down"
sprite_index = spr_player_walk_down;
image_index += 0;