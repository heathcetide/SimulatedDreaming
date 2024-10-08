/// @DnDAction : YoYo Games.Common.Apply_To
/// @DnDVersion : 1
/// @DnDHash : 2755A071
/// @DnDComment : The action below will apply to ALL instances in the room
/// @DnDApplyTo : all
with(all) {
	/// @DnDAction : YoYo Games.Instances.Set_Instance_Var
	/// @DnDVersion : 1
	/// @DnDHash : 62F33A44
	/// @DnDComment : Set the instance's depth to negative bbox_bottom$(13_10)$(13_10)bbox_bottom is the Y coordinate at the bottom edge$(13_10)of the instance's mask$(13_10)$(13_10)That point is used for depth-sorting these instances
	/// @DnDParent : 2755A071
	/// @DnDArgument : "value" "-bbox_bottom"
	/// @DnDArgument : "instvar" "9"
	depth = -bbox_bottom;
}