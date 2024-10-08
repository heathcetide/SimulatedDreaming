/// @DnDAction : YoYo Games.Common.If_Variable
/// @DnDVersion : 1
/// @DnDHash : 7885B08F
/// @DnDComment : When an animation ends, this$(13_10)will check if the baddie is attacking.
/// @DnDArgument : "var" "attacking"
/// @DnDArgument : "value" "true"
if(attacking == true)
{
	/// @DnDAction : YoYo Games.Common.Variable
	/// @DnDVersion : 1
	/// @DnDHash : 016C2F3B
	/// @DnDComment : In that case, it will set$(13_10)'attacking' to false to$(13_10)end the attack.
	/// @DnDParent : 7885B08F
	/// @DnDArgument : "expr" "false"
	/// @DnDArgument : "var" "attacking"
	attacking = false;

	/// @DnDAction : YoYo Games.Paths.Path_Speed
	/// @DnDVersion : 1
	/// @DnDHash : 6FE2F3D1
	/// @DnDComment : Restore the path follow speed$(13_10)so the baddie starts following$(13_10)its path again.
	/// @DnDParent : 7885B08F
	/// @DnDArgument : "speed" "move_speed"
	path_speed = move_speed;
}