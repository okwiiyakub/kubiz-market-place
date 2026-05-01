from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True, max_length=255)
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'password']

    def create(self, validated_data):
        full_name = validated_data['full_name']
        email = validated_data['email']
        password = validated_data['password']

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "This email is already registered."})

        base_username = email.split("@")[0]
        username = base_username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        name_parts = full_name.strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        return user


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name']

    def get_full_name(self, obj):
        return obj.get_full_name()


class UpdateProfileSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)

    def update(self, instance, validated_data):
        full_name = validated_data.get("full_name", "")

        name_parts = full_name.strip().split(" ", 1)
        instance.first_name = name_parts[0] if name_parts else ""
        instance.last_name = name_parts[1] if len(name_parts) > 1 else ""
        instance.save()

        return instance


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=6)