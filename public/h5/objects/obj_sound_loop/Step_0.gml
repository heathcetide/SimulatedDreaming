/// @DnDAction : YoYo Games.Instances.If_Instance_Exists
/// @DnDVersion : 1
/// @DnDHash : 4245D4AA
/// @DnDComment : If the player does not exist$(13_10)(meaning it has been defeated)
/// @DnDArgument : "obj" "obj_player"
/// @DnDArgument : "not" "1"
/// @DnDSaveInfo : "obj" "obj_player"
var l4245D4AA_0 = false;
l4245D4AA_0 = instance_exists(obj_player);
if(!l4245D4AA_0)
{
	/// @DnDAction : YoYo Games.Common.Exit_Event
	/// @DnDVersion : 1
	/// @DnDHash : 3403C56C
	/// @DnDComment : Exit/stop the event.
	/// @DnDParent : 4245D4AA
	exit;
}

/// @DnDAction : YoYo Games.Common.Temp_Variable
/// @DnDVersion : 1
/// @DnDHash : 54B48378
/// @DnDComment : Get the distance from this instance$(13_10)to the player.
/// @DnDArgument : "var" "distance"
/// @DnDArgument : "value" "point_distance(x, y, obj_player.x, obj_player.y)"
var distance = point_distance(x, y, obj_player.x, obj_player.y);

/// @DnDAction : YoYo Games.Common.If_Variable
/// @DnDVersion : 1
/// @DnDHash : 1B7D08FA
/// @DnDComment : If the distance is less than a certain limit
/// @DnDArgument : "var" "distance"
/// @DnDArgument : "op" "1"
/// @DnDArgument : "value" "300"
if(distance < 300)
{
	/// @DnDAction : YoYo Games.Audio.If_Audio_Paused
	/// @DnDVersion : 1
	/// @DnDHash : 400D4FEC
	/// @DnDComment : And the sound is paused,
	/// @DnDParent : 1B7D08FA
	/// @DnDArgument : "soundid" "my_sound"
	var l400D4FEC_0 = my_sound;
	if (audio_is_paused(l400D4FEC_0))
	{
		/// @DnDAction : YoYo Games.Audio.Resume_Audio
		/// @DnDVersion : 1
		/// @DnDHash : 25057305
		/// @DnDComment : Resume it
		/// @DnDParent : 400D4FEC
		/// @DnDArgument : "sound" "my_sound"
		audio_resume_sound(my_sound);
	}

	/// @DnDAction : YoYo Games.Audio.Audio_Set_Volume
	/// @DnDVersion : 1
	/// @DnDHash : 062F108D
	/// @DnDComment : The volume of the sound is changed$(13_10)based on this distance to the player.
	/// @DnDParent : 1B7D08FA
	/// @DnDArgument : "sound" "my_sound"
	/// @DnDArgument : "volume" "min(100 / distance, 1)"
	audio_sound_gain(my_sound, min(100 / distance, 1), 0);
}

/// @DnDAction : YoYo Games.Common.Else
/// @DnDVersion : 1
/// @DnDHash : 475D6A0F
/// @DnDComment : Otherwise, if it's out of range
else
{
	/// @DnDAction : YoYo Games.Audio.If_Audio_Playing
	/// @DnDVersion : 1
	/// @DnDHash : 391B9441
	/// @DnDComment : And the sound is still playing,
	/// @DnDParent : 475D6A0F
	/// @DnDArgument : "soundid" "my_sound"
	var l391B9441_0 = my_sound;
	if (audio_is_playing(l391B9441_0))
	{
		/// @DnDAction : YoYo Games.Audio.Pause_Audio
		/// @DnDVersion : 1
		/// @DnDHash : 47698F8E
		/// @DnDComment : Pause it
		/// @DnDParent : 391B9441
		/// @DnDArgument : "sound" "my_sound"
		audio_pause_sound(my_sound);
	}
}