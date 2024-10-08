/// @DnDAction : YoYo Games.Data Structures.Map_Get_Value
/// @DnDVersion : 1
/// @DnDHash : 48C31B9B
/// @DnDComment : The broadcast messages for this object are set$(13_10)up in the player walk sprites, where each footstep$(13_10)frame has a broadcast message assigned to it.$(13_10)$(13_10)This action retrieves the received message from the$(13_10)'event_data' map.
/// @DnDArgument : "assignee" "message"
/// @DnDArgument : "assignee_temp" "1"
/// @DnDArgument : "var" "event_data"
/// @DnDArgument : "key" ""message""
var message = ds_map_find_value(event_data, "message");

/// @DnDAction : YoYo Games.Common.If_Variable
/// @DnDVersion : 1
/// @DnDHash : 5FB56E3A
/// @DnDComment : This condition checks if the received message is$(13_10)"step".
/// @DnDArgument : "var" "message"
/// @DnDArgument : "value" ""step""
if(message == "step")
{
	/// @DnDAction : YoYo Games.Audio.Play_Audio
	/// @DnDVersion : 1
	/// @DnDHash : 7C90C8E7
	/// @DnDComment : If it is, then the footstep sound is$(13_10)played.
	/// @DnDParent : 5FB56E3A
	/// @DnDArgument : "soundid" "snd_footstep"
	/// @DnDSaveInfo : "soundid" "snd_footstep"
	audio_play_sound(snd_footstep, 0, 0);
}