/// @DnDAction : YoYo Games.Common.Variable
/// @DnDVersion : 1
/// @DnDHash : 4D7FF0B7
/// @DnDComment : The movement speed of the$(13_10)enemy along its path.
/// @DnDArgument : "expr" "2"
/// @DnDArgument : "var" "move_speed"
move_speed = 2;

/// @DnDAction : YoYo Games.Common.Variable
/// @DnDVersion : 1
/// @DnDHash : 220A9F10
/// @DnDComment : This will be true when the baddie$(13_10)is attacking the player, otherwise$(13_10)it will be false.
/// @DnDArgument : "expr" "false"
/// @DnDArgument : "var" "attacking"
attacking = false;

/// @DnDAction : YoYo Games.Paths.Start_Path
/// @DnDVersion : 1.1
/// @DnDHash : 5BF1EF42
/// @DnDComment : Starts following the path$(13_10)stored in the path_to_follow$(13_10)variable. This is created in$(13_10)the "Variable Definitions" $(13_10)menu.$(13_10)$(13_10)path_action_continue means that$(13_10)once it reaches the end of that$(13_10)path, it continues following it$(13_10)and doesn't stop.
/// @DnDArgument : "path" "path_to_follow"
/// @DnDArgument : "speed" "move_speed"
/// @DnDArgument : "atend" "path_action_continue"
/// @DnDArgument : "relative" "true"
path_start(path_to_follow, move_speed, path_action_continue, true);