# Generated by Django 4.2.7 on 2024-05-13 04:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0026_remove_test_session"),
    ]

    operations = [
        migrations.AddField(
            model_name="classroom",
            name="teacher",
            field=models.CharField(default=None, max_length=200),
        ),
    ]
